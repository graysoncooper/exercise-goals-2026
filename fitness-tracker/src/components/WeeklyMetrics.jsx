import { useState } from 'react';
import { useWeeklyMetrics } from '../hooks/useStorage';
import { calculate7DayAverage } from '../utils/storage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

const WeeklyMetrics = () => {
  const { metrics, addMetric, deleteMetric } = useWeeklyMetrics();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    vo2Max: '',
    hrv: '',
    restingHeartRate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addMetric({
      date: formData.date,
      vo2Max: Number(formData.vo2Max),
      hrv: Number(formData.hrv),
      restingHeartRate: Number(formData.restingHeartRate),
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      vo2Max: '',
      hrv: '',
      restingHeartRate: '',
    });
    setShowForm(false);
  };

  // Prepare chart data
  const chartData = [...metrics]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((metric) => ({
      date: format(new Date(metric.date), 'MM/dd'),
      vo2Max: metric.vo2Max,
      hrv: metric.hrv,
      restingHeartRate: metric.restingHeartRate,
    }));

  // Calculate current stats and trends
  const latestMetric = [...metrics].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const hrv7DayAvg = calculate7DayAverage(metrics);

  // Calculate trends (comparing latest to first metric)
  const firstMetric = [...metrics].sort((a, b) => new Date(a.date) - new Date(b.date))[0];
  const calculateTrend = (current, initial) => {
    if (!current || !initial) return 0;
    return current - initial;
  };

  const vo2Trend = latestMetric && firstMetric ? calculateTrend(latestMetric.vo2Max, firstMetric.vo2Max) : 0;
  const hrvTrend = latestMetric && firstMetric ? calculateTrend(latestMetric.hrv, firstMetric.hrv) : 0;
  const rhrTrend = latestMetric && firstMetric ? calculateTrend(latestMetric.restingHeartRate, firstMetric.restingHeartRate) : 0;

  const TrendIndicator = ({ value, reverse = false }) => {
    const isPositive = reverse ? value < 0 : value > 0;
    const color = isPositive ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-gray-400';
    const arrow = isPositive ? '↑' : value < 0 ? '↓' : '→';
    return (
      <span className={`${color} text-sm ml-2`}>
        {arrow} {Math.abs(value).toFixed(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Weekly Metrics</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ Log Metrics'}
        </button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">VO2 Max</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold">{latestMetric?.vo2Max || 51}</p>
            <TrendIndicator value={vo2Trend} />
          </div>
          <p className="text-xs text-gray-500 mt-1">Higher is better</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">HRV</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold">{latestMetric?.hrv || 47}ms</p>
            <TrendIndicator value={hrvTrend} />
          </div>
          <p className="text-xs text-gray-500 mt-1">7-day avg: {hrv7DayAvg || 'N/A'}ms</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Resting HR</p>
          <div className="flex items-center">
            <p className="text-3xl font-bold">{latestMetric?.restingHeartRate || 60}bpm</p>
            <TrendIndicator value={rhrTrend} reverse />
          </div>
          <p className="text-xs text-gray-500 mt-1">Lower is better</p>
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
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">VO2 Max</label>
              <input
                type="number"
                value={formData.vo2Max}
                onChange={(e) => setFormData({ ...formData, vo2Max: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                required
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">HRV (ms)</label>
              <input
                type="number"
                value={formData.hrv}
                onChange={(e) => setFormData({ ...formData, hrv: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                value={formData.restingHeartRate}
                onChange={(e) => setFormData({ ...formData, restingHeartRate: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                required
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Log Metrics
          </button>
        </form>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <>
          {/* VO2 Max Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">VO2 Max Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="vo2Max"
                  stroke="#A855F7"
                  strokeWidth={2}
                  name="VO2 Max"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* HRV Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">HRV Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hrv"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="HRV (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Resting Heart Rate Chart */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Resting Heart Rate Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="restingHeartRate"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Resting HR (bpm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Recent Logs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Logs</h3>
        {metrics.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No metrics logged yet. Start tracking!</p>
        ) : (
          <div className="space-y-3">
            {[...metrics]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((metric) => (
                <div key={metric.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold mb-2">{format(new Date(metric.date), 'MMM dd, yyyy')}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">VO2 Max</p>
                          <p className="font-semibold text-purple-400">{metric.vo2Max}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">HRV</p>
                          <p className="font-semibold text-blue-400">{metric.hrv}ms</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Resting HR</p>
                          <p className="font-semibold text-green-400">{metric.restingHeartRate}bpm</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMetric(metric.id)}
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

export default WeeklyMetrics;
