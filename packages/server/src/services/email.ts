
import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN || "YOUR_MAILTRAP_TOKEN";
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "Admin@brainshift.in";

const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: SENDER_EMAIL,
  name: "BrainShift",
};

export async function sendInviteEmail(toEmail: string, fromName: string) {
  try {
    await mailtrapClient.send({
      from: sender,
      to: [{ email: toEmail }],
      subject: "You have a new friend request on BrainShift!",
      text: `Hi,

You have received a new friend request from ${fromName} on BrainShift.

Log in to your account to accept or reject the request.

Thanks,
The BrainShift Team`,
      category: "Friend Request",
    });
    console.log(`Sent friend request email to ${toEmail}`);
  } catch (error) {
    console.error(`Failed to send friend request email to ${toEmail}:`, error);
  }
}
