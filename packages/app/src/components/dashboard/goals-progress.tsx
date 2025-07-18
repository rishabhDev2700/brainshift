import { Progress } from "@/components/ui/progress";

interface GoalsProgressProps {
  achieved: number;
  total: number;
}

export function GoalsProgress({ achieved, total }: GoalsProgressProps) {
  const progress = (achieved / total) * 100;
  return (
    <div>
      <h3 className="font-semibold text-sm my-4">
        Achieved Goals {achieved} out of {total}
      </h3>
      <Progress value={progress} color="bg-emerald-600" />
    </div>
  );
}
