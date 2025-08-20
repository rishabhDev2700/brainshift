
import { useQuery } from "@tanstack/react-query";
import { dataClient } from "../services/api-service";

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastStreakDate: string | null;
}

const fetchStreak = async () => {
  const response = await dataClient.get("/streaks");
  return response.data;
};

export const useStreaks = () => {
  return useQuery<Streak>({
    queryKey: ["streak"],
    queryFn: fetchStreak,
  });
};
