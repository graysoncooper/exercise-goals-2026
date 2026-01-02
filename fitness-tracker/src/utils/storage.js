// LocalStorage keys
const STORAGE_KEYS = {
  SQUAT_LOGS: 'fitness_squat_logs',
  MILE_LOGS: 'fitness_mile_logs',
  WEEKLY_METRICS: 'fitness_weekly_metrics',
  DUNK_ATTEMPTS: 'fitness_dunk_attempts',
  GOALS_STATUS: 'fitness_goals_status',
  PROGRAM_SETTINGS: 'fitness_program_settings',
  WORKOUT_LOGS: 'fitness_workout_logs',
};

// Initialize default data
const DEFAULT_DATA = {
  squatLogs: [],
  mileLogs: [],
  weeklyMetrics: [
    {
      id: Date.now(),
      date: new Date().toISOString(),
      vo2Max: 51,
      hrv: 47,
      restingHeartRate: 60,
    }
  ],
  dunkAttempts: [],
  goalsStatus: {
    dunk360: false,
    backSquat250: false,
    mile700: false,
  },
  programSettings: {
    startDate: null, // Will be set by user
    currentWeek: 1,
  },
  workoutLogs: [],
};

// Storage utility functions
export const storage = {
  // Generic get/set
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  // Squat logs
  getSquatLogs() {
    return this.get(STORAGE_KEYS.SQUAT_LOGS) || DEFAULT_DATA.squatLogs;
  },

  addSquatLog(log) {
    const logs = this.getSquatLogs();
    const newLog = {
      id: Date.now(),
      ...log,
    };
    logs.push(newLog);
    this.set(STORAGE_KEYS.SQUAT_LOGS, logs);
    return newLog;
  },

  deleteSquatLog(id) {
    const logs = this.getSquatLogs().filter(log => log.id !== id);
    this.set(STORAGE_KEYS.SQUAT_LOGS, logs);
  },

  // Mile logs
  getMileLogs() {
    return this.get(STORAGE_KEYS.MILE_LOGS) || DEFAULT_DATA.mileLogs;
  },

  addMileLog(log) {
    const logs = this.getMileLogs();
    const newLog = {
      id: Date.now(),
      ...log,
    };
    logs.push(newLog);
    this.set(STORAGE_KEYS.MILE_LOGS, logs);
    return newLog;
  },

  deleteMileLog(id) {
    const logs = this.getMileLogs().filter(log => log.id !== id);
    this.set(STORAGE_KEYS.MILE_LOGS, logs);
  },

  // Weekly metrics
  getWeeklyMetrics() {
    return this.get(STORAGE_KEYS.WEEKLY_METRICS) || DEFAULT_DATA.weeklyMetrics;
  },

  addWeeklyMetric(metric) {
    const metrics = this.getWeeklyMetrics();
    const newMetric = {
      id: Date.now(),
      ...metric,
    };
    metrics.push(newMetric);
    this.set(STORAGE_KEYS.WEEKLY_METRICS, metrics);
    return newMetric;
  },

  deleteWeeklyMetric(id) {
    const metrics = this.getWeeklyMetrics().filter(m => m.id !== id);
    this.set(STORAGE_KEYS.WEEKLY_METRICS, metrics);
  },

  // Dunk attempts
  getDunkAttempts() {
    return this.get(STORAGE_KEYS.DUNK_ATTEMPTS) || DEFAULT_DATA.dunkAttempts;
  },

  addDunkAttempt(attempt) {
    const attempts = this.getDunkAttempts();
    const newAttempt = {
      id: Date.now(),
      ...attempt,
    };
    attempts.push(newAttempt);
    this.set(STORAGE_KEYS.DUNK_ATTEMPTS, attempts);

    // Check if goal is achieved
    if (newAttempt.result === 'made') {
      this.updateGoalStatus('dunk360', true);
    }

    return newAttempt;
  },

  deleteDunkAttempt(id) {
    const attempts = this.getDunkAttempts().filter(a => a.id !== id);
    this.set(STORAGE_KEYS.DUNK_ATTEMPTS, attempts);
  },

  // Goals status
  getGoalsStatus() {
    return this.get(STORAGE_KEYS.GOALS_STATUS) || DEFAULT_DATA.goalsStatus;
  },

  updateGoalStatus(goalKey, achieved) {
    const status = this.getGoalsStatus();
    status[goalKey] = achieved;
    this.set(STORAGE_KEYS.GOALS_STATUS, status);
  },

  // Check if dunk attempts should be unlocked (squat >= 235)
  isDunkUnlocked() {
    const squatLogs = this.getSquatLogs();
    if (squatLogs.length === 0) return false;

    // Get the highest weight logged
    const maxWeight = Math.max(...squatLogs.map(log => log.weight));
    return maxWeight >= 235;
  },

  // Program settings
  getProgramSettings() {
    return this.get(STORAGE_KEYS.PROGRAM_SETTINGS) || DEFAULT_DATA.programSettings;
  },

  setProgramStartDate(startDate) {
    const settings = this.getProgramSettings();
    settings.startDate = startDate;
    this.set(STORAGE_KEYS.PROGRAM_SETTINGS, settings);
  },

  updateCurrentWeek(weekNumber) {
    const settings = this.getProgramSettings();
    settings.currentWeek = weekNumber;
    this.set(STORAGE_KEYS.PROGRAM_SETTINGS, settings);
  },

  // Workout logs
  getWorkoutLogs() {
    return this.get(STORAGE_KEYS.WORKOUT_LOGS) || DEFAULT_DATA.workoutLogs;
  },

  addWorkoutLog(log) {
    const logs = this.getWorkoutLogs();
    const newLog = {
      id: Date.now(),
      ...log,
    };
    logs.push(newLog);
    this.set(STORAGE_KEYS.WORKOUT_LOGS, logs);
    return newLog;
  },

  updateWorkoutLog(id, updates) {
    const logs = this.getWorkoutLogs();
    const index = logs.findIndex(log => log.id === id);
    if (index !== -1) {
      logs[index] = { ...logs[index], ...updates };
      this.set(STORAGE_KEYS.WORKOUT_LOGS, logs);
      return logs[index];
    }
    return null;
  },

  deleteWorkoutLog(id) {
    const logs = this.getWorkoutLogs().filter(log => log.id !== id);
    this.set(STORAGE_KEYS.WORKOUT_LOGS, logs);
  },

  // Get workout logs for a specific date
  getWorkoutLogByDate(date) {
    const logs = this.getWorkoutLogs();
    return logs.find(log => log.date === date);
  },

  // Get workout logs for a date range
  getWorkoutLogsByDateRange(startDate, endDate) {
    const logs = this.getWorkoutLogs();
    return logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= new Date(startDate) && logDate <= new Date(endDate);
    });
  },

  // Initialize storage with default data if empty
  initialize() {
    if (!this.get(STORAGE_KEYS.WEEKLY_METRICS)) {
      this.set(STORAGE_KEYS.WEEKLY_METRICS, DEFAULT_DATA.weeklyMetrics);
    }
    if (!this.get(STORAGE_KEYS.GOALS_STATUS)) {
      this.set(STORAGE_KEYS.GOALS_STATUS, DEFAULT_DATA.goalsStatus);
    }
    if (!this.get(STORAGE_KEYS.PROGRAM_SETTINGS)) {
      this.set(STORAGE_KEYS.PROGRAM_SETTINGS, DEFAULT_DATA.programSettings);
    }
    if (!this.get(STORAGE_KEYS.WORKOUT_LOGS)) {
      this.set(STORAGE_KEYS.WORKOUT_LOGS, DEFAULT_DATA.workoutLogs);
    }
  },
};

// Calculate estimated 1RM using Epley formula: weight × (1 + reps/30)
export const calculate1RM = (weight, reps) => {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
};

// Get squat progression plan
export const getSquatProgression = () => {
  return {
    phase1: {
      name: 'Weeks 1-6: 5x5 Foundation',
      weeks: '1-6',
      sets: 5,
      reps: 5,
      startWeight: 185,
      endWeight: 210,
    },
    phase2: {
      name: 'Weeks 7-10: 3x3 Strength',
      weeks: '7-10',
      sets: 3,
      reps: 3,
      startWeight: 215,
      endWeight: 235,
    },
    phase3: {
      name: 'Weeks 11-12: Singles Peak',
      weeks: '11-12',
      sets: '1-3',
      reps: 1,
      startWeight: 240,
      endWeight: 250,
    },
  };
};

// Get mile checkpoints
export const getMileCheckpoints = () => {
  return {
    baseline: { time: '7:56', week: 0 },
    checkpoint1: { time: '7:30-7:45', week: 8 },
    goal: { time: '7:00', week: 16 },
  };
};

// Convert time string (MM:SS) to seconds
export const timeToSeconds = (timeStr) => {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  return minutes * 60 + seconds;
};

// Convert seconds to time string (MM:SS)
export const secondsToTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Calculate 7-day rolling average for HRV
export const calculate7DayAverage = (metrics) => {
  if (metrics.length === 0) return null;

  // Sort by date descending
  const sorted = [...metrics].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  // Take last 7 entries
  const last7 = sorted.slice(0, 7);

  if (last7.length === 0) return null;

  const sum = last7.reduce((acc, m) => acc + (m.hrv || 0), 0);
  return Math.round(sum / last7.length);
};
