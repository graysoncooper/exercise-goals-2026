import { useState, useEffect } from 'react';
import { storage, calculate1RM } from '../utils/storage';
import { format, parseISO, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const WorkoutTracker = () => {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    sets: '',
    reps: '',
    notes: '',
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    setWorkouts(storage.getSquatLogs());
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    storage.addSquatLog({
      date: formData.date,
      weight: parseFloat(formData.weight),
      sets: parseInt(formData.sets),
      reps: parseInt(formData.reps),
      notes: formData.notes,
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      sets: '',
      reps: '',
      notes: '',
    });

    loadWorkouts();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      storage.deleteSquatLog(id);
      loadWorkouts();
    }
  };

  // Get workouts grouped by week
  const getWeeklyStats = () => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 0 });
    const lastWeekStart = subWeeks(thisWeekStart, 1);
    const lastWeekEnd = subWeeks(thisWeekEnd, 1);

    const thisWeekWorkouts = workouts.filter(w => {
      const workoutDate = parseISO(w.date);
      return isWithinInterval(workoutDate, { start: thisWeekStart, end: thisWeekEnd });
    });

    const lastWeekWorkouts = workouts.filter(w => {
      const workoutDate = parseISO(w.date);
      return isWithinInterval(workoutDate, { start: lastWeekStart, end: lastWeekEnd });
    });

    const getMaxWeight = (workouts) => {
      if (workouts.length === 0) return null;
      return Math.max(...workouts.map(w => w.weight));
    };

    const getMax1RM = (workouts) => {
      if (workouts.length === 0) return null;
      return Math.max(...workouts.map(w => calculate1RM(w.weight, w.reps)));
    };

    return {
      thisWeek: {
        workouts: thisWeekWorkouts,
        maxWeight: getMaxWeight(thisWeekWorkouts),
        max1RM: getMax1RM(thisWeekWorkouts),
        count: thisWeekWorkouts.length,
      },
      lastWeek: {
        workouts: lastWeekWorkouts,
        maxWeight: getMaxWeight(lastWeekWorkouts),
        max1RM: getMax1RM(lastWeekWorkouts),
        count: lastWeekWorkouts.length,
      },
    };
  };

  const weeklyStats = getWeeklyStats();
  const sortedWorkouts = [...workouts].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculate changes
  const weightChange = weeklyStats.thisWeek.maxWeight && weeklyStats.lastWeek.maxWeight
    ? weeklyStats.thisWeek.maxWeight - weeklyStats.lastWeek.maxWeight
    : null;

  const oneRMChange = weeklyStats.thisWeek.max1RM && weeklyStats.lastWeek.max1RM
    ? weeklyStats.thisWeek.max1RM - weeklyStats.lastWeek.max1RM
    : null;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Workout Tracker</h2>

      {/* Week Over Week Progress */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Week Over Week Progress</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* This Week */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-3 text-blue-400">This Week</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Workouts</span>
                <span className="font-semibold">{weeklyStats.thisWeek.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Weight</span>
                <span className="font-semibold">
                  {weeklyStats.thisWeek.maxWeight ? `${weeklyStats.thisWeek.maxWeight}lb` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated 1RM</span>
                <span className="font-semibold">
                  {weeklyStats.thisWeek.max1RM ? `${weeklyStats.thisWeek.max1RM}lb` : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Last Week */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-3 text-purple-400">Last Week</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Workouts</span>
                <span className="font-semibold">{weeklyStats.lastWeek.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Weight</span>
                <span className="font-semibold">
                  {weeklyStats.lastWeek.maxWeight ? `${weeklyStats.lastWeek.maxWeight}lb` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated 1RM</span>
                <span className="font-semibold">
                  {weeklyStats.lastWeek.max1RM ? `${weeklyStats.lastWeek.max1RM}lb` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Changes */}
        {weightChange !== null && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Weight Change</p>
                <p className={`text-xl font-bold ${weightChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {weightChange >= 0 ? '+' : ''}{weightChange}lb
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">1RM Change</p>
                <p className={`text-xl font-bold ${oneRMChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {oneRMChange >= 0 ? '+' : ''}{oneRMChange.toFixed(1)}lb
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log New Workout */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Log New Workout</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="185"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sets</label>
              <input
                type="number"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Reps</label>
              <input
                type="number"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              placeholder="Felt strong today..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition-colors"
          >
            Log Workout
          </button>
        </form>
      </div>

      {/* Recent Workouts */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Workouts</h3>

        {sortedWorkouts.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No workouts logged yet. Start tracking your progress!
          </p>
        ) : (
          <div className="space-y-3">
            {sortedWorkouts.map((workout) => {
              const estimated1RM = calculate1RM(workout.weight, workout.reps);
              return (
                <div key={workout.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-lg">
                        {workout.weight}lb × {workout.sets} sets × {workout.reps} reps
                      </p>
                      <p className="text-gray-400 text-sm">
                        {format(parseISO(workout.date), 'MMM d, yyyy')} • Est. 1RM: {estimated1RM}lb
                      </p>
                      {workout.notes && (
                        <p className="text-gray-300 text-sm mt-2 italic">"{workout.notes}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="text-red-400 hover:text-red-300 text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTracker;
