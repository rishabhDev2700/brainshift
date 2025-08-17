import { MailtrapClient } from "mailtrap";
import { db } from "../db/db";
import { TaskTable } from "../db/schemas/tasks";
import { EventTable } from "../db/schemas/events";
import { UserTable } from "../db/schemas/users";
import { and, eq, gte, lte, ne, sql } from "drizzle-orm";

// Mailtrap configuration (replace with your actual values or environment variables)
const TOKEN = process.env.MAILTRAP_TOKEN || "YOUR_MAILTRAP_TOKEN";
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "Admin@brainshift.in";

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: SENDER_EMAIL,
  name: "BrainShift Reminders",
};

export async function checkAndSendReminders() {
  console.log("Checking for tasks/events due today for reminders...");
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const endOfToday = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1);

    const tasksDueToday = await db
      .select({
        id: TaskTable.id,
        title: TaskTable.title,
        deadline: TaskTable.deadline,
        userEmail: sql<string>`${UserTable.email}`,
        userId: UserTable.id,
        type: sql<"task">`'task'`,
      })
      .from(TaskTable)
      .innerJoin(UserTable, eq(TaskTable.userId, UserTable.id))
      .where(
        and(
          and(
            ne(TaskTable.status, "COMPLETED"),
            ne(TaskTable.status, "CANCELLED")
          ),
          gte(TaskTable.deadline, today),
          lte(TaskTable.deadline, endOfToday)
        )
      );

    const eventsDueToday = await db
      .select({
        id: EventTable.id,
        title: EventTable.title,
        date: EventTable.date,
        userEmail: sql<string>`${UserTable.email}`,
        userId: UserTable.id,
        type: sql<"event">`'event'`,
      })
      .from(EventTable)
      .innerJoin(UserTable, eq(EventTable.userId, UserTable.id))
      .where(
        and(gte(EventTable.date, today), lte(EventTable.date, endOfToday))
      );

    const allDueItems = [...tasksDueToday, ...eventsDueToday];

    if (allDueItems.length === 0) {
      console.log("No tasks or events due for reminder today.");
      return;
    }

    const usersToRemind = new Map<
      number,
      { email: string; tasks: any[]; events: any[] }
    >();

    for (const item of allDueItems) {
      if (!usersToRemind.has(item.userId)) {
        usersToRemind.set(item.userId, {
          email: item.userEmail,
          tasks: [],
          events: [],
        });
      }
      const userEntry = usersToRemind.get(item.userId)!;
      if (item.type === "task") {
        userEntry.tasks.push(item);
      } else if (item.type === "event") {
        userEntry.events.push(item);
      }
    }

    console.log(
      `Found ${usersToRemind.size} users to send reminders to. Sending emails...`
    );

    for (const [userId, userData] of usersToRemind.entries()) {
      let emailBody = `Hi,\n\nHere's a summary of your tasks and events due today:\n\n`;

      if (userData.tasks.length > 0) {
        emailBody += "Tasks:\n";
        userData.tasks.forEach((task) => {
          emailBody += `- ${task.title} (Due: ${new Date(
            task.deadline
          ).toLocaleTimeString()})\n`;
        });
        emailBody += "\n";
      }

      if (userData.events.length > 0) {
        emailBody += "Events:\n";
        userData.events.forEach((event) => {
          emailBody += `- ${event.title} (At: ${new Date(
            event.date
          ).toLocaleTimeString()})\n`;
        });
        emailBody += "\n";
      }

      emailBody += "Keep up the great work!\nBrainShift Team";

      try {
        await mailtrapClient.send({
          from: sender,
          to: [{ email: userData.email }],
          subject: "Daily Reminder: Your tasks and events due today!",
          text: emailBody,
          category: "Daily Reminder",
        });
        console.log(
          `Sent daily reminder to user ${userId} (${userData.email})`
        );
      } catch (emailError) {
        console.error(
          `Failed to send daily reminder to user ${userId} (${userData.email}):`,
          emailError
        );
      }
    }
    console.log("Finished sending daily reminders.");
  } catch (dbError) {
    console.error(
      "Error checking for tasks/events due for reminders:",
      dbError
    );
  }
}
