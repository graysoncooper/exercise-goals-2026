import { useState } from 'react';
import { useSquatLogs } from '../hooks/useStorage';
import { calculate1RM, getSquatProgression } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const SquatTracker = () => {
  const { logs, addLog, deleteLog } = useSquatLogs();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    sets: '',
    reps: '',
    notes: '',
  });

  const progression = getSquatProgression();

  const handleSubmit = (e) => {
    e.preventDefault();
    addLog({
      date: formData.date,
      weight: Number(formData.weight),
      sets: Number(formData.sets),
      reps: Number(formData.reps),
      notes: formData.notes,
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      sets: '',
      reps: '',
      notes: '',
    });
    setShowForm(false);
  };

  // Prepare chart data
  const chartData = [...logs]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((log) => ({
      date: format(new Date(log.date), 'MM/dd'),
      weight: log.weight,
      estimated1RM: calculate1RM(log.weight, log.reps),
    }));

  // Calculate current stats
  const latestLog = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const currentWeight = latestLog ? latestLog.weight : 185;
  const current1RM = latestLog ? calculate1RM(latestLog.weight, latestLog.reps) : 185;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Back Squat Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ Log Session'}
        </button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Current Working Weight</p>
          <p className="text-3xl font-bold">{currentWeight}lb</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Estimated 1RM</p>
          <p className="text-3xl font-bold">{current1RM}lb</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">To Goal</p>
          <p className="text-3xl font-bold">{250 - current1RM}lb</p>
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (lb)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sets</label>
              <input
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reps</label>
              <input
                type="number"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              rows="2"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Log Session
          </button>
        </form>
      )}

      {/* Progression Plan */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Progression Plan</h3>
        <div className="space-y-3">
          {Object.values(progression).map((phase, idx) => (
            <div key={idx} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold mb-2">{phase.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
                <p>Sets × Reps: {phase.sets} × {phase.reps}</p>
                <p>Weight: {phase.startWeight}lb → {phase.endWeight}lb</p>
              </div>
            </div>
          ))}
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
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Working Weight"
              />
              <Line
                type="monotone"
                dataKey="estimated1RM"
                stroke="#10B981"
                strokeWidth={2}
                name="Estimated 1RM"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Logs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
        {logs.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No sessions logged yet. Start tracking!</p>
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
                        <span className="text-blue-400 font-bold">{log.weight}lb</span>
                        <span className="text-gray-400 text-sm">{log.sets} × {log.reps}</span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Estimated 1RM: <span className="text-green-400 font-semibold">{calculate1RM(log.weight, log.reps)}lb</span>
                      </p>
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

export default SquatTracker;
