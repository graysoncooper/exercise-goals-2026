import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ResponsiveContainer } from 'recharts';
import { storage, calculate1RM } from '../utils/storage';
import { SQUAT_PROGRESSION } from '../utils/programData';
import { useProgramWeek } from '../hooks/useProgramWeek';

const ProgressCharts = () => {
  const { currentWeek, isConfigured } = useProgramWeek();
  const [squatData, setSquatData] = useState([]);
  const [mileData, setMileData] = useState([]);

  useEffect(() => {
    loadSquatData();
    loadMileData();
  }, []);

  const loadSquatData = () => {
    const logs = storage.getSquatLogs();
    const workoutLogs = storage.getWorkoutLogs();

    // Combine old squat logs with new workout logs
    const allSquatData = [];

    // Add old squat logs
    logs.forEach(log => {
      allSquatData.push({
        date: log.date,
        weight: log.weight,
        reps: log.reps,
        est1RM: calculate1RM(log.weight, log.reps),
      });
    });

    // Add squat data from workout logs
    workoutLogs.forEach(workout => {
      const squatExercise = workout.exercises.find(e => e.exerciseId === 'thu-main-1');
      if (squatExercise && squatExercise.loggedSets.length > 0) {
        const firstSet = squatExercise.loggedSets[0];
        allSquatData.push({
          date: workout.date,
          weight: firstSet.weight,
          reps: firstSet.reps,
          est1RM: calculate1RM(firstSet.weight, firstSet.reps),
          week: workout.weekNumber,
        });
      }
    });

    // Sort by date
    allSquatData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group by week and take max
    const weeklyData = {};
    allSquatData.forEach(item => {
      const week = item.week || 'Unknown';
      if (!weeklyData[week] || item.est1RM > weeklyData[week].est1RM) {
        weeklyData[week] = item;
      }
    });

    setSquatData(Object.values(weeklyData));
  };

  const loadMileData = () => {
    const logs = storage.getMileLogs();
    const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedLogs.map(log => ({
      date: log.date,
      timeSeconds: timeToSeconds(log.time),
      time: log.time,
    }));

    setMileData(chartData);
  };

  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate target progression line for squat
  const squatTargetData = SQUAT_PROGRESSION.map(p => ({
    week: p.week,
    targetWeight: p.weight,
    target1RM: p.est1RM,
  }));

  // Merge actual data with targets for squat chart
  const squatChartData = squatTargetData.map(target => {
    const actual = squatData.find(d => d.week === target.week);
    return {
      week: `W${target.week}`,
      target: target.target1RM,
      actual: actual?.est1RM || null,
    };
  });

  if (!isConfigured) {
    return (
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-yellow-400">⚠️ Program Not Configured</h3>
        <p className="text-gray-300">
          Please set your program start date in Program Settings to see progress charts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Progress Charts</h2>

      {/* Squat Progress */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Squat Progression</h3>

        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={squatChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="week" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[150, 260]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <ReferenceLine y={250} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Goal', fill: '#10B981' }} />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#60A5FA"
                strokeWidth={2}
                name="Target 1RM"
                dot={{ fill: '#60A5FA', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#34D399"
                strokeWidth={2}
                name="Actual 1RM"
                dot={{ fill: '#34D399', r: 5 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm text-gray-400 mb-1">Current Week</p>
            <p className="text-2xl font-bold text-blue-400">Week {currentWeek}</p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm text-gray-400 mb-1">Target 1RM</p>
            <p className="text-2xl font-bold">
              {SQUAT_PROGRESSION.find(p => p.week === currentWeek)?.est1RM || 214} lb
            </p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <p className="text-sm text-gray-400 mb-1">Goal 1RM</p>
            <p className="text-2xl font-bold text-green-400">250 lb</p>
          </div>
        </div>
      </div>

      {/* Mile Progress */}
      {mileData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Mile Time Progression</h3>

          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mileData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9CA3AF"
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis
                  stroke="#9CA3AF"
                  domain={[400, 500]}
                  tickFormatter={formatTime}
                  reversed
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                  formatter={(value) => formatTime(value)}
                />
                <Legend />
                <ReferenceLine
                  y={420}
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  label={{ value: 'Goal (7:00)', fill: '#10B981' }}
                />
                <Line
                  type="monotone"
                  dataKey="timeSeconds"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Mile Time"
                  dot={{ fill: '#F59E0B', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-sm text-gray-400 mb-1">Best Time</p>
              <p className="text-2xl font-bold text-yellow-400">
                {mileData[mileData.length - 1]?.time || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-sm text-gray-400 mb-1">Goal Time</p>
              <p className="text-2xl font-bold text-green-400">7:00</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-sm text-gray-400 mb-1">Improvement</p>
              <p className="text-2xl font-bold">
                {mileData.length >= 2
                  ? `-${(mileData[0].timeSeconds - mileData[mileData.length - 1].timeSeconds)} sec`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Program Summary</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Program Progress</span>
              <span className="text-sm text-gray-400">{currentWeek} / 12 weeks</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentWeek / 12) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-700 rounded p-3 text-center">
              <p className="text-2xl font-bold text-blue-400">{squatData.length}</p>
              <p className="text-xs text-gray-400">Squat Sessions</p>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{mileData.length}</p>
              <p className="text-xs text-gray-400">Mile Runs</p>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{storage.getWorkoutLogs().length}</p>
              <p className="text-xs text-gray-400">Total Workouts</p>
            </div>
            <div className="bg-gray-700 rounded p-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{12 - currentWeek}</p>
              <p className="text-xs text-gray-400">Weeks Remaining</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;
