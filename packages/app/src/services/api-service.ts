import axios from "axios";
import { type TaskSchema, type GoalSchema } from "@/types";
const baseURL = import.meta.env.VITE_API_DOMAIN;

const authClient = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const dataClient = axios.create({
  baseURL: baseURL,
  timeout: 5000,
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
};

export const dataService = {
  // Events Resource

  getEvents: async () => {
    try {
      const res = await dataClient.get("/events");
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  getEventById: async (id: number) => {
    try {
      const res = await dataClient.get(`/events/${id}`);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  addEvent: async (data: {}) => {
    try {
      const res = await dataClient.post("/events", data);
      return res;
    } catch (err) {
      console.log(err);
    }
  },
  updateEvent: async (id: number, data: {}) => {
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
  addGoal: async (data:GoalSchema) => {
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
};
