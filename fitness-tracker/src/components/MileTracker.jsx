import { useState } from 'react';
import { useMileLogs } from '../hooks/useStorage';
import { getMileCheckpoints, timeToSeconds, secondsToTime } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';

const MileTracker = () => {
  const { logs, addLog, deleteLog } = useMileLogs();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: 'outdoor',
    notes: '',
  });

  const checkpoints = getMileCheckpoints();

  const handleSubmit = (e) => {
    e.preventDefault();
    addLog({
      date: formData.date,
      time: formData.time,
      location: formData.location,
      notes: formData.notes,
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      time: '',
      location: 'outdoor',
      notes: '',
    });
    setShowForm(false);
  };

  // Prepare chart data
  const chartData = [...logs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((log) => ({
      date: format(new Date(log.date), 'MM/dd'),
      seconds: timeToSeconds(log.time),
      displayTime: log.time,
    }));

  // Calculate current stats
  const bestTime = logs.length > 0
    ? logs.reduce((best, log) => {
        const currentSeconds = timeToSeconds(log.time);
        const bestSeconds = timeToSeconds(best);
        return currentSeconds < bestSeconds ? log.time : best;
      }, logs[0].time)
    : '7:56';

  const latestLog = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const currentTime = latestLog ? latestLog.time : '7:56';

  // Calculate time to goal
  const bestSeconds = timeToSeconds(bestTime);
  const goalSeconds = timeToSeconds('7:00');
  const timeToGoal = bestSeconds - goalSeconds;

  // Custom tooltip for time display
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded p-2">
          <p className="text-sm">{payload[0].payload.date}</p>
          <p className="text-sm font-bold text-blue-400">{payload[0].payload.displayTime}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Mile Time Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ Log Run'}
        </button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Latest Time</p>
          <p className="text-3xl font-bold">{currentTime}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Best Time</p>
          <p className="text-3xl font-bold text-green-400">{bestTime}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">To Goal</p>
          <p className="text-3xl font-bold">
            {timeToGoal > 0 ? `-${timeToGoal}s` : 'GOAL MET! 🎉'}
          </p>
        </div>
      </div>

      {/* Log Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time (MM:SS)</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="7:30"
                pattern="[0-9]+:[0-5][0-9]"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
              >
                <option value="outdoor">Outdoor</option>
                <option value="treadmill">Treadmill</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
              rows="2"
              placeholder="Weather, how you felt, etc."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Log Run
          </button>
        </form>
      )}

      {/* Checkpoints */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Checkpoints</h3>
        <div className="space-y-3">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Baseline</p>
                <p className="text-sm text-gray-400">Week {checkpoints.baseline.week}</p>
              </div>
              <p className="text-xl font-bold">{checkpoints.baseline.time}</p>
            </div>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Checkpoint 1</p>
                <p className="text-sm text-gray-400">Week {checkpoints.checkpoint1.week}</p>
              </div>
              <p className="text-xl font-bold">{checkpoints.checkpoint1.time}</p>
            </div>
          </div>
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-green-400">Final Goal</p>
                <p className="text-sm text-gray-400">Week {checkpoints.goal.week}</p>
              </div>
              <p className="text-xl font-bold text-green-400">{checkpoints.goal.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Progress Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis
                stroke="#9CA3AF"
                domain={['dataMin - 10', 'dataMax + 10']}
                tickFormatter={(value) => secondsToTime(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={timeToSeconds('7:00')}
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{ value: 'Goal: 7:00', fill: '#10B981', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="seconds"
                stroke="#10B981"
                strokeWidth={2}
                name="Mile Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Logs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Runs</h3>
        {logs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No runs logged yet. Start tracking!</p>
        ) : (
          <div className="space-y-3">
            {[...logs]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log) => (
                <div key={log.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <p className="font-semibold">{format(new Date(log.date), 'MMM dd, yyyy')}</p>
                        <span className="text-green-400 font-bold text-xl">{log.time}</span>
                        <span className="text-gray-400 text-sm capitalize">
                          {log.location === 'outdoor' ? '🌳 Outdoor' : '🏃 Treadmill'}
                        </span>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-gray-300 mt-2">{log.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="text-red-400 hover:text-red-300 text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MileTracker;
