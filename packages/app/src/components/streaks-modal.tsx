
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useStreaks } from "../hooks/useStreaks";
import { Flame, Trophy } from "lucide-react";

interface StreaksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreaksModal = ({ isOpen, onClose }: StreaksModalProps) => {
  const { data: streak, isLoading, isError } = useStreaks();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-emerald-950/70 backdrop-blur-md border border-emerald-500/30 text-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold tracking-wider text-emerald-400">
            Your Streaks
          </DialogTitle>
        </DialogHeader>
        {isLoading && <p className="text-center">Loading...</p>}
        {isError && <p className="text-center text-red-500">Error fetching streaks.</p>}
        {streak && (
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
        )}
      </DialogContent>
    </Dialog>
  );
};
