import axios from "axios";
import {
  type TaskSchema,
  type GoalSchema,
  type EventSchema,
  type SessionSchema,
} from "@/types";
const baseURL = import.meta.env.VITE_API_DOMAIN;
console.log(baseURL);
const authClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const dataClient = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

dataClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

dataClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status == 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export const authService = {
  login: async (creds: { email: string; password: string }) => {
    try {
      console.log(baseURL);
      const res = await authClient.post("/auth/login", creds);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  register: async (data: {
    email: string;
    fullName: string;
    password: string;
  }) => {
    const res = await authClient.post("/auth/register", data);
    return res;
  },
  googleLogin: async (token: string) => {
    try {
      const res = await authClient.post("/auth/google", { token });
      return res;
    } catch (err) {
      console.log(err);
    }
  },
};

export const dataService = {
  // Events Resource

  getEvents: async (): Promise<EventSchema[]> => {
    try {
      const res = await dataClient.get<EventSchema[]>("/events");
      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  getEventsByDate: async (date: string): Promise<EventSchema[]> => {
    try {
      const res = await dataClient.get<EventSchema[]>(
        `/events/search?date=${date}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  getEventById: async (id: number): Promise<EventSchema> => {
    try {
      const res = await dataClient.get<EventSchema>(`/events/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw Error("Invalid Error");
    }
  },
  addEvent: async (data: EventSchema) => {
    try {
      const res = await dataClient.post("/events", data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  updateEvent: async (id: number, data: EventSchema) => {
    try {
      const res = await dataClient.put(`/events/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  deleteEvent: async (id: number) => {
    try {
      const res = await dataClient.delete(`/events/${id}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  // Tasks resource

  getTasks: async () => {
    try {
      const res = await dataClient.get<TaskSchema[]>("/tasks");
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  getTaskById: async (id: number) => {
    try {
      const res = await dataClient.get<TaskSchema>(`/tasks/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  addTask: async (data: TaskSchema) => {
    try {
      const res = await dataClient.post("/tasks", data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  updateTask: async (id: number, data: TaskSchema) => {
    try {
      const res = await dataClient.put(`/tasks/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  deleteTask: async (id: number) => {
    try {
      const res = await dataClient.delete(`/tasks/${id}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  // Subtasks Resource

  addSubtask: async (taskID: number, data: {}) => {
    try {
      const res = await dataClient.post(`/tasks/${taskID}/subtasks`, data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  updateSubtask: async (taskID: number, id: number, data: {}) => {
    try {
      const res = await dataClient.put(`/tasks/${taskID}/subtasks/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  deleteSubtask: async (taskID: number, id: number) => {
    try {
      const res = await dataClient.delete(`/tasks/${taskID}/subtasks/${id}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  // Goals resource

  getGoals: async (): Promise<GoalSchema[]> => {
    try {
      const res = await dataClient.get<GoalSchema[]>("/goals");
      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  getGoalById: async (id: number): Promise<GoalSchema> => {
    try {
      const res = await dataClient.get<GoalSchema>(`/goals/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw Error("Invalid Error");
    }
  },
  addGoal: async (data: GoalSchema) => {
    try {
      const res = await dataClient.post("/goals", data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  updateGoal: async (id: number, goal: GoalSchema) => {
    try {
      const res = await dataClient.put(`/goals/${id}`, goal);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  deleteGoal: async (id: number) => {
    try {
      const res = await dataClient.delete(`/goals/${id}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  // User resource

  getProfile: async () => {
    try {
      const res = await dataClient.get("/users/me");
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },

  updateProfile: async (data: { fullName: string; email: string }) => {
    try {
      const res = await dataClient.put("/users/me", data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },

  // Sessions resource

  getSessions: async (): Promise<SessionSchema[]> => {
    try {
      const res = await dataClient.get<SessionSchema[]>("/sessions");
      return res.data;
    } catch (err) {
      console.log(err);
      return [];
    }
  },
  getSessionById: async (id: number): Promise<SessionSchema> => {
    try {
      const res = await dataClient.get<SessionSchema>(`/sessions/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw Error("Invalid Error");
    }
  },
  addSession: async (data: SessionSchema) => {
    try {
      const res = await dataClient.post("/sessions", data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  updateSession: async (id: number, data: Partial<SessionSchema>) => {
    try {
      const res = await dataClient.put(`/sessions/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  deleteSession: async (id: number) => {
    try {
      const res = await dataClient.delete(`/sessions/${id}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  cancelSession: async (id: number) => {
    try {
      const res = await dataClient.patch(`/sessions/${id}/cancel`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  completeSession: async (id: number, completed: boolean) => {
    try {
      const res = await dataClient.patch(`/sessions/${id}/completed`, {
        completed,
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  },
};
