import { useState } from "react";
import { Badge } from "./ui/badge";
import { Flame } from "lucide-react";
import { useStreaks } from "@/hooks/useStreaks";
import { StreaksModal } from "./streaks-modal";

export function CurrentStreakBadge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: streak, isLoading } = useStreaks();

  const getStreakColorClass = (currentStreak: number) => {
    const maxStreak = 30; // Define a maximum streak for color scaling
    const ratio = Math.min(currentStreak / maxStreak, 1); // Ensure ratio doesn't exceed 1

    // Interpolate between blue (low streak) and red (high streak)
    // Tailwind CSS classes for a gradient from blue-500 to red-500
    if (ratio < 0.2) return "bg-blue-500 hover:bg-blue-600";
    if (ratio < 0.4) return "bg-green-500 hover:bg-green-600";
    if (ratio < 0.6) return "bg-yellow-500 hover:bg-yellow-600";
    if (ratio < 0.8) return "bg-orange-500 hover:bg-orange-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const handleBadgeClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading || !streak) {
    return null; // Don't render if loading or no streak data
  }

  const badgeColorClass = getStreakColorClass(streak?.currentStreak || 0);

  return (
    <>
      <Badge
        className={`fixed bottom-4 left-4 md:left-auto md:right-4 cursor-pointer ${badgeColorClass} text-white text-lg px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50`}
        onClick={handleBadgeClick}
      >
        <Flame className="h-5 w-5" />
        <span>{streak?.currentStreak || 0} days</span>
      </Badge>
      <StreaksModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
