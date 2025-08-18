import type { SessionSchema } from '@/types';

type PomodoroPhase = 'work' | 'break';

interface ActiveSessionTimerProps {
  session: SessionSchema;
  currentPhase: PomodoroPhase;
  remainingTime: number;
}

export function ActiveSessionTimer({ session, currentPhase, remainingTime }: ActiveSessionTimerProps) {

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);

    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return `${isNegative ? '-' : ''}${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
  };

  const isCountdown = session.isPomodoro && session.duration;
  const isBreak = isCountdown && currentPhase === 'break';

  const timerColor = isBreak ? 'text-red-600 bg-red-100 dark:bg-red-900' : 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900';

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        {isCountdown ? (isBreak ? 'Break Time' : 'Work Time') : 'Time Elapsed'}
      </h3>
      <p className={`text-4xl md:text-6xl font-sixtyFour font-bold text-center p-4 rounded-lg ${timerColor}`}>
        {formatTime(remainingTime)}
      </p>
    </div>
  );
}