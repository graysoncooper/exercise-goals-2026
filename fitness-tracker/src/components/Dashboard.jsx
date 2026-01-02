import { useEffect, useState } from 'react';
import { storage, calculate1RM, timeToSeconds } from '../utils/storage';

const Dashboard = ({ onNavigate }) => {
  const [squatLogs, setSquatLogs] = useState([]);
  const [mileLogs, setMileLogs] = useState([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState([]);
  const [dunkAttempts, setDunkAttempts] = useState([]);
  const [goalsStatus, setGoalsStatus] = useState({});

  useEffect(() => {
    // Load all data
    setSquatLogs(storage.getSquatLogs());
    setMileLogs(storage.getMileLogs());
    setWeeklyMetrics(storage.getWeeklyMetrics());
    setDunkAttempts(storage.getDunkAttempts());
    setGoalsStatus(storage.getGoalsStatus());
  }, []);

  // Calculate squat progress
  const getSquatProgress = () => {
    if (squatLogs.length === 0) {
      return { current: 185, target: 250, percentage: 0, estimated1RM: 185 };
    }

    const latestLog = [...squatLogs].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )[0];

    const estimated1RM = calculate1RM(latestLog.weight, latestLog.reps);
    const percentage = Math.min(100, (estimated1RM / 250) * 100);

    return {
      current: latestLog.weight,
      target: 250,
      percentage,
      estimated1RM,
    };
  };

  // Calculate mile progress
  const getMileProgress = () => {
    if (mileLogs.length === 0) {
      return { current: '7:56', target: '7:00', percentage: 0 };
    }

    const latestLog = [...mileLogs].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )[0];

    const currentSeconds = timeToSeconds(latestLog.time);
    const targetSeconds = timeToSeconds('7:00');
    const baselineSeconds = timeToSeconds('7:56');

    // Calculate percentage improvement from baseline to target
    const totalImprovement = baselineSeconds - targetSeconds;
    const currentImprovement = baselineSeconds - currentSeconds;
    const percentage = Math.min(100, Math.max(0, (currentImprovement / totalImprovement) * 100));

    return {
      current: latestLog.time,
      target: '7:00',
      percentage,
    };
  };

  // Get latest metrics
  const getLatestMetrics = () => {
    if (weeklyMetrics.length === 0) {
      return { vo2Max: 51, hrv: 47, restingHeartRate: 60 };
    }

    const latest = [...weeklyMetrics].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )[0];

    return {
      vo2Max: latest.vo2Max,
      hrv: latest.hrv,
      restingHeartRate: latest.restingHeartRate,
    };
  };

  const squatProgress = getSquatProgress();
  const mileProgress = getMileProgress();
  const latestMetrics = getLatestMetrics();
  const isDunkUnlocked = storage.isDunkUnlocked();
  const hasDunked = dunkAttempts.some(a => a.result === 'made');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Squat Goal */}
        <div
          className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
          onClick={() => onNavigate('squat')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">250lb Back Squat</h3>
            <span className="text-2xl">🏋️</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Working Weight</span>
              <span className="font-semibold">{squatProgress.current}lb</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated 1RM</span>
              <span className="font-semibold">{squatProgress.estimated1RM}lb</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${squatProgress.percentage}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-400 mt-1">
                {squatProgress.percentage.toFixed(0)}% to goal
              </p>
            </div>
          </div>
        </div>

        {/* Mile Goal */}
        <div
          className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors"
          onClick={() => onNavigate('mile')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">7:00 Mile</h3>
            <span className="text-2xl">🏃</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Current Best</span>
              <span className="font-semibold">{mileProgress.current}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target</span>
              <span className="font-semibold">{mileProgress.target}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${mileProgress.percentage}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-400 mt-1">
                {mileProgress.percentage.toFixed(0)}% to goal
              </p>
            </div>
          </div>
        </div>

        {/* Dunk Goal */}
        <div
          className={`bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-750 transition-colors ${
            !isDunkUnlocked ? 'opacity-60' : ''
          }`}
          onClick={() => onNavigate('dunk')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">360 Dunk</h3>
            <span className="text-2xl">🏀</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Status</span>
              <span className={`font-semibold ${hasDunked ? 'text-green-400' : 'text-yellow-400'}`}>
                {hasDunked ? 'ACHIEVED! 🎉' : isDunkUnlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Attempts</span>
              <span className="font-semibold">{dunkAttempts.length}</span>
            </div>

            {!isDunkUnlocked && (
              <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
                🔒 Unlock at 235lb squat
              </div>
            )}

            {isDunkUnlocked && !hasDunked && (
              <div className="mt-4 p-3 bg-blue-900/30 rounded text-sm text-blue-300">
                ✨ Ready to attempt!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Metrics */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Latest Metrics</h3>
          <button
            onClick={() => onNavigate('metrics')}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">VO2 Max</p>
            <p className="text-2xl font-bold">{latestMetrics.vo2Max}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">HRV</p>
            <p className="text-2xl font-bold">{latestMetrics.hrv}ms</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Resting HR</p>
            <p className="text-2xl font-bold">{latestMetrics.restingHeartRate}bpm</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Squat Sessions</p>
          <p className="text-2xl font-bold">{squatLogs.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Mile Runs</p>
          <p className="text-2xl font-bold">{mileLogs.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Metric Logs</p>
          <p className="text-2xl font-bold">{weeklyMetrics.length}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Dunk Attempts</p>
          <p className="text-2xl font-bold">{dunkAttempts.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
