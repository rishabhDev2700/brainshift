export interface TaskSchema {
  id?: number;
  title: string;
  description: string;
  status: "NOT STARTED"|"IN PROGRESS"|"COMPLETED"|"CANCELLED";
  priority: number;
  deadline: string;
  goalId?: number;
}

export interface GoalSchema {
  id?: number;
  title: string;
  description: string;
  status: "NOT STARTED" | "IN PROGRESS" | "COMPLETED" | "CANCELLED";
  priority: number;
  deadline: string;
  parentId?: number;
}

export interface EventSchema {
    id?: number;
    title: string;
    description: string;
    date: string;
}
