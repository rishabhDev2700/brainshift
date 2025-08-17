import axios from "axios";
import {
  type TaskSchema,
  type GoalSchema,
  type EventSchema,
  type SessionSchema,
  type SubtaskSchema,
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
      throw err; 
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
      throw err; 
    }
  },
  getEventById: async (id: number): Promise<EventSchema> => {
    try {
      const res = await dataClient.get<EventSchema>(`/events/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  addEvent: async (data: EventSchema) => {
    try {
      const res = await dataClient.post("/events", data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  updateEvent: async (id: number, data: EventSchema) => {
    try {
      const res = await dataClient.put(`/events/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  deleteEvent: async (id: number) => {
    try {
      const res = await dataClient.delete(`/events/${id}`);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },

  // Tasks resource

  getTasks: async (): Promise<TaskSchema[]> => {
    try {
      const res = await dataClient.get<TaskSchema[]>("/tasks");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  getTaskById: async (id: number) => {
    try {
      const res = await dataClient.get<TaskSchema>(`/tasks/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  addTask: async (data: TaskSchema) => {
    try {
      const res = await dataClient.post("/tasks", data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  updateTask: async (id: number, data: TaskSchema) => {
    try {
      const res = await dataClient.put(`/tasks/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  deleteTask: async (id: number) => {
    try {
      const res = await dataClient.delete(`/tasks/${id}`);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },

  // Subtasks Resource

  addSubtask: async (taskID: number, data: SubtaskSchema) => {
    try {
      const res = await dataClient.post(`/tasks/${taskID}/subtasks`, data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  updateSubtask: async (taskID: number, id: number, data: SubtaskSchema) => {
    try {
      const res = await dataClient.put(`/tasks/${taskID}/subtasks/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  deleteSubtask: async (taskID: number, id: number) => {
    try {
      const res = await dataClient.delete(`/tasks/${taskID}/subtasks/${id}`);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },

  getAllSubtasksForUser: async (): Promise<SubtaskSchema[]> => {
    try {
      const res = await dataClient.get<SubtaskSchema[]>("/tasks/subtasks");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },

  // Goals resource

  getGoals: async (): Promise<GoalSchema[]> => {
    try {
      const res = await dataClient.get<GoalSchema[]>("/goals");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  getGoalById: async (id: number): Promise<GoalSchema> => {
    try {
      const res = await dataClient.get<GoalSchema>(`/goals/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  addGoal: async (data: GoalSchema) => {
    try {
      const res = await dataClient.post("/goals", data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  updateGoal: async (id: number, goal: GoalSchema) => {
    try {
      const res = await dataClient.put(`/goals/${id}`, goal);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  deleteGoal: async (id: number) => {
    try {
      const res = await dataClient.delete(`/goals/${id}`);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
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
      throw err; 
    }
  },

  updateProfile: async (data: { fullName: string; email: string }) => {
    try {
      const res = await dataClient.put("/users/me", data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },

  // Sessions resource

  getSessions: async (): Promise<SessionSchema[]> => {
    try {
      const res = await dataClient.get<SessionSchema[]>("/sessions");
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  getSessionById: async (id: number): Promise<SessionSchema> => {
    try {
      const res = await dataClient.get<SessionSchema>(`/sessions/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  addSession: async (data: SessionSchema) => {
    try {
      const res = await dataClient.post("/sessions", data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  updateSession: async (id: number, data: Partial<SessionSchema>) => {
    try {
      const res = await dataClient.put(`/sessions/${id}`, data);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  deleteSession: async (id: number) => {
    try {
      const res = await dataClient.delete(`/sessions/${id}`);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
    }
  },
  cancelSession: async (id: number) => {
    try {
      const res = await dataClient.patch(`/sessions/${id}/cancel`);
      return res;
    } catch (err) {
      console.log(err);
      throw err; 
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
      throw err; 
    }
  },

  // Analytics resource

  getAnalyticsDashboard: async (queryString?: string) => {
    try {
      const url = queryString ? `/analytics/dashboard?${queryString}` : "/analytics/dashboard";
      const res = await dataClient.get(url);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  submitFeedback: async (data: { message: string; rating?: number; category?: string }) => {
    try {
      const res = await dataClient.post("/feedback", data);
      return res.data;
    } catch (err) {
      console.error("Error submitting feedback:", err);
      throw err;
    }
  },

  getFriendsFeedbackStatus: async (): Promise<{ hasGivenFeedback: boolean }> => {
    try {
      const res = await dataClient.get("/feedback/status/friends");
      return res.data;
    } catch (err) {
      console.error("Error fetching friends feedback status:", err);
      throw err;
    }
  },

  searchAll: async (query: string): Promise<{ tasks: TaskSchema[]; goals: GoalSchema[]; events: EventSchema[]; }> => {
    try {
      const res = await dataClient.get(`/search?query=${query}`);
      return res.data;
    } catch (err) {
      console.error("Error during search:", err);
      throw err;
    }
  },
};
