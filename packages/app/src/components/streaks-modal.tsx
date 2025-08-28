
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useStreaks } from "@/hooks/useStreaks";
import { Flame, Trophy } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface StreaksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreaksModal = ({ isOpen, onClose }: StreaksModalProps) => {
  const queryClient = useQueryClient();
  const { data: streak, isLoading, isError } = useStreaks();

  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    }
  }, [isOpen, queryClient]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-emerald-950/30 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/30 text-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-emerald-400">
            Your Streaks
          </DialogTitle>
        </DialogHeader>
        {isLoading && <p className="text-center">Loading...</p>}
        {isError && <p className="text-center text-red-500">Error fetching streaks.</p>}
        {streak && streak.currentStreak > 0 ? (
          <div className="flex flex-col items-center gap-6 p-6">
            <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg w-full justify-center">
              <Flame className="w-10 h-10 text-orange-400 animate-pulse" />
              <div>
                <p className="text-lg font-semibold text-emerald-300">Current Streak</p>
                <p className="text-3xl font-bold">{streak.currentStreak} days</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg w-full justify-center">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <div>
                <p className="text-lg font-semibold text-emerald-300">Longest Streak</p>
                <p className="text-3xl font-bold">{streak.longestStreak} days</p>
              </div>
            </div>
            <p className="text-lg font-medium text-emerald-200 mt-4">
              Keep up the great work! 🔥
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 p-6">
            <p className="text-lg font-medium text-emerald-200 mt-4">
              You're not on a streak yet.<br />Complete a minimum 25-minute session to start one!
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
