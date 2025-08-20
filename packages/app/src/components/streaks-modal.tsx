
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useStreaks } from "../hooks/useStreaks";

interface StreaksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StreaksModal = ({ isOpen, onClose }: StreaksModalProps) => {
  const { data: streak, isLoading, isError } = useStreaks();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Streaks</DialogTitle>
        </DialogHeader>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error fetching streaks.</p>}
        {streak && (
          <div>
            <p>Current Streak: {streak.currentStreak}</p>
            <p>Longest Streak: {streak.longestStreak}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
