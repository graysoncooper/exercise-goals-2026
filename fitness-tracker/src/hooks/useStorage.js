import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

// Custom hook to sync state with localStorage
export const useSquatLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(storage.getSquatLogs());
  }, []);

  const addLog = (log) => {
    const newLog = storage.addSquatLog(log);
    setLogs(storage.getSquatLogs());
    return newLog;
  };

  const deleteLog = (id) => {
    storage.deleteSquatLog(id);
    setLogs(storage.getSquatLogs());
  };

  return { logs, addLog, deleteLog };
};

export const useMileLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(storage.getMileLogs());
  }, []);

  const addLog = (log) => {
    const newLog = storage.addMileLog(log);
    setLogs(storage.getMileLogs());
    return newLog;
  };

  const deleteLog = (id) => {
    storage.deleteMileLog(id);
    setLogs(storage.getMileLogs());
  };

  return { logs, addLog, deleteLog };
};

export const useWeeklyMetrics = () => {
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    setMetrics(storage.getWeeklyMetrics());
  }, []);

  const addMetric = (metric) => {
    const newMetric = storage.addWeeklyMetric(metric);
    setMetrics(storage.getWeeklyMetrics());
    return newMetric;
  };

  const deleteMetric = (id) => {
    storage.deleteWeeklyMetric(id);
    setMetrics(storage.getWeeklyMetrics());
  };

  return { metrics, addMetric, deleteMetric };
};

export const useDunkAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    setAttempts(storage.getDunkAttempts());
    setIsUnlocked(storage.isDunkUnlocked());
  }, []);

  const addAttempt = (attempt) => {
    const newAttempt = storage.addDunkAttempt(attempt);
    setAttempts(storage.getDunkAttempts());
    return newAttempt;
  };

  const deleteAttempt = (id) => {
    storage.deleteDunkAttempt(id);
    setAttempts(storage.getDunkAttempts());
  };

  const checkUnlock = () => {
    const unlocked = storage.isDunkUnlocked();
    setIsUnlocked(unlocked);
    return unlocked;
  };

  return { attempts, addAttempt, deleteAttempt, isUnlocked, checkUnlock };
};

export const useGoalsStatus = () => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    setStatus(storage.getGoalsStatus());
  }, []);

  const updateStatus = (goalKey, achieved) => {
    storage.updateGoalStatus(goalKey, achieved);
    setStatus(storage.getGoalsStatus());
  };

  return { status, updateStatus };
};
