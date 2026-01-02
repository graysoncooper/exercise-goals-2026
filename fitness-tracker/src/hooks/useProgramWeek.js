import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { differenceInWeeks, parseISO, startOfDay } from 'date-fns';

/**
 * Custom hook to manage program week awareness
 * Returns current week number (1-12) based on program start date
 */
export const useProgramWeek = () => {
  const [programSettings, setProgramSettings] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    loadProgramSettings();
  }, []);

  const loadProgramSettings = () => {
    const settings = storage.getProgramSettings();
    setProgramSettings(settings);

    if (settings.startDate) {
      setIsConfigured(true);
      const week = calculateCurrentWeek(settings.startDate);
      setCurrentWeek(week);
    } else {
      setIsConfigured(false);
      setCurrentWeek(1);
    }
  };

  const calculateCurrentWeek = (startDate) => {
    const start = startOfDay(parseISO(startDate));
    const today = startOfDay(new Date());
    const weeksSinceStart = differenceInWeeks(today, start);

    // Clamp between 1 and 12
    const week = Math.min(Math.max(weeksSinceStart + 1, 1), 12);
    return week;
  };

  const setStartDate = (dateString) => {
    storage.setProgramStartDate(dateString);
    loadProgramSettings();
  };

  const getWeekForDate = (dateString) => {
    if (!programSettings?.startDate) return 1;
    const start = startOfDay(parseISO(programSettings.startDate));
    const target = startOfDay(parseISO(dateString));
    const weeksSinceStart = differenceInWeeks(target, start);
    return Math.min(Math.max(weeksSinceStart + 1, 1), 12);
  };

  const getCurrentPhase = () => {
    if (currentWeek <= 6) return 'build';
    if (currentWeek <= 10) return 'strength';
    return 'peak';
  };

  return {
    currentWeek,
    isConfigured,
    startDate: programSettings?.startDate,
    setStartDate,
    getWeekForDate,
    getCurrentPhase,
    reload: loadProgramSettings,
  };
};
