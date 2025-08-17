import { useState, useEffect, useRef } from 'react';
import type { SessionSchema } from '@/types';

interface ActiveSessionTimerProps {
  session: SessionSchema;
  onComplete: (id: number) => void;
}

export function ActiveSessionTimer({ session, onComplete }: ActiveSessionTimerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCompletedRef = useRef(false);
  useEffect(() => {
    hasCompletedRef.current = false;

    const start = new Date(session.startTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);

      if (session.isPomodoro === true && session.duration) {
        const totalSeconds = session.duration * 60;
        const remaining = totalSeconds - elapsed;
        setCurrentTime(remaining);

        if (remaining <= 0 && !hasCompletedRef.current && !session.completed && !session.isCancelled) {
          hasCompletedRef.current = true;
          onComplete(session.id!);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } else {
        setCurrentTime(elapsed);
      }
    };

    updateTimer();

    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [session.id, session.startTime, session.duration, session.isPomodoro, onComplete]);

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);

    const h = Math.floor(absSeconds / 3600);
    const m = Math.floor((absSeconds % 3600) / 60);
    const s = absSeconds % 60;

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return `${isNegative ? '-' : ''}${formatNumber(h)}:${formatNumber(m)}:${formatNumber(s)}`;
  };

  const isPomodoroSession = session.isPomodoro === true;
  const isOvertime = isPomodoroSession && currentTime < 0;

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-2">
          {isPomodoroSession ? 'Time Remaining' : 'Time Elapsed'}
          {isOvertime && ' (Overtime)'}
        </h3>
        <p className={`text-5xl md:text-8xl font-mono font-bold text-center p-4 rounded-lg ${isOvertime ? 'text-red-500 animate-pulse bg-red-100 dark:bg-red-900' : 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900'}`}>
          {formatTime(currentTime)}
        </p>
      </div>

      <div className="text-sm text-gray-600">
        {isPomodoroSession && session.duration && (
          <p>Target Duration: {session.duration} minutes</p>
        )}
        {!isPomodoroSession && (
          <p>Manual session - mark as complete when finished</p>
        )}
        <p>Session Type: {isPomodoroSession ? 'Pomodoro' : 'Manual'}</p>
        <p>Started: {new Date(session.startTime).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}