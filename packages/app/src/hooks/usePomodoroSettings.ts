import { useState, useEffect } from 'react';

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
};

export function usePomodoroSettings() {
  const [settings, setSettings] = useState<PomodoroSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('pomodoroSettings');
      return storedSettings ? JSON.parse(storedSettings) : defaultSettings;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [settings]);

  return { settings, setSettings };
}
