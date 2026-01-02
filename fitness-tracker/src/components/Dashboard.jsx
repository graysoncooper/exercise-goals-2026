import { useEffect, useState } from 'react';
import { storage, calculate1RM } from '../utils/storage';

const Dashboard = ({ onNavigate }) => {
  const [squatLogs, setSquatLogs] = useState([]);

  useEffect(() => {
    // Load all data
    setSquatLogs(storage.getSquatLogs());
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

  const squatProgress = getSquatProgress();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      {/* Main Goal Card */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">250lb Back Squat Goal</h3>
          <span className="text-3xl">🏋️</span>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Current Working Weight</p>
              <p className="text-2xl font-bold">{squatProgress.current}lb</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Estimated 1RM</p>
              <p className="text-2xl font-bold">{squatProgress.estimated1RM}lb</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-4">
              <div
                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${squatProgress.percentage}%` }}
              />
            </div>
            <p className="text-right text-sm text-gray-400 mt-2">
              {squatProgress.percentage.toFixed(0)}% to goal • {squatProgress.estimated1RM} / 250 lbs
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('workouts')}
          className="bg-blue-700 hover:bg-blue-600 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">Track Workouts</h3>
            <span className="text-2xl">💪</span>
          </div>
          <p className="text-gray-300 text-sm">Log your workouts and see week-over-week progress</p>
        </button>
        <button
          onClick={() => onNavigate('calendar')}
          className="bg-purple-700 hover:bg-purple-600 rounded-lg p-6 text-left transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold">View Calendar</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="text-gray-300 text-sm">See your daily workouts and schedule</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
