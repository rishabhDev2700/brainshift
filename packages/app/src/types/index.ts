export interface TaskSchema {
  id?: number;
  title: string;
  description?: string;
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: number;
  deadline: string;
  goalId?: number;
  subtasks?: SubtaskSchema[];
}

export interface SubtaskSchema {
  id?: number;
  title: string;
  description: string;
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: number;
  deadline: string;
  taskId?: number;
}

export interface GoalSchema {
  id?: number;
  title: string;
  description?: string;
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: number;
  deadline: string;
  parentId?: number;
}

export interface EventSchema {
  id?: number;
  title: string;
  description?: string;
  date: string;
}

export interface SessionSchema {
  id?: number;
  targetType: "task" | "subtask";
  targetId?: number;
  startTime: string;
  endTime?: string;
  duration?: number;
  breakDuration?: number; // New field for break duration
  isCancelled?: boolean;
  isPomodoro?: boolean;
  completed?: boolean;
  userId?: number;
}
