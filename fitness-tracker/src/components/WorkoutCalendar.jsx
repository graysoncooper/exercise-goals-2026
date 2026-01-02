import { useState, useEffect } from 'react';
import { storage, calculate1RM } from '../utils/storage';
import { format, parseISO, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const WorkoutCalendar = () => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutLogs, setWorkoutLogs] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'
  const [currentMonthStart, setCurrentMonthStart] = useState(startOfMonth(new Date()));

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    setWorkouts(storage.getSquatLogs());
    setWorkoutLogs(storage.getWorkoutLogs());
  };

  const weekSchedule = [
    {
      day: 'Sunday',
      short: 'Sun',
      workout: 'Basketball',
      icon: '🏀',
      color: 'bg-orange-900/30 border-orange-700',
      description: 'Skill work and practice',
    },
    {
      day: 'Monday',
      short: 'Mon',
      workout: 'Cardio',
      icon: '🏃',
      color: 'bg-green-900/30 border-green-700',
      description: 'Easy run, 30-45 min',
    },
    {
      day: 'Tuesday',
      short: 'Tue',
      workout: 'Squat Day',
      icon: '🏋️',
      color: 'bg-blue-900/30 border-blue-700',
      description: 'Main strength training',
    },
    {
      day: 'Wednesday',
      short: 'Wed',
      workout: 'Cardio',
      icon: '🏃',
      color: 'bg-green-900/30 border-green-700',
      description: 'Easy run, 30-45 min',
    },
    {
      day: 'Thursday',
      short: 'Thu',
      workout: 'Upper Body',
      icon: '💪',
      color: 'bg-purple-900/30 border-purple-700',
      description: 'Accessory work',
    },
    {
      day: 'Friday',
      short: 'Fri',
      workout: 'Conditioning',
      icon: '⏱️',
      color: 'bg-red-900/30 border-red-700',
      description: 'Sprint work or intervals',
    },
    {
      day: 'Saturday',
      short: 'Sat',
      workout: 'Active Recovery',
      icon: '🧘',
      color: 'bg-gray-700 border-gray-600',
      description: 'Stretch, yoga, or rest',
    },
  ];

  const getWorkoutsForDay = (dayIndex) => {
    const dayDate = addDays(currentWeekStart, dayIndex);
    return workouts.filter(w => isSameDay(parseISO(w.date), dayDate));
  };

  const getWorkoutStatus = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const log = workoutLogs.find(l => l.date === dateStr);

    if (!log) return 'none';
    if (log.completed) return 'completed';

    const completedExercises = log.exercises.filter(e => !e.skipped && e.loggedSets.length > 0).length;
    const totalExercises = log.exercises.length;

    if (completedExercises === 0) return 'skipped';
    if (completedExercises < totalExercises) return 'partial';
    return 'completed';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'partial':
        return 'bg-yellow-600';
      case 'skipped':
        return 'bg-gray-600';
      default:
        return 'bg-gray-800';
    }
  };

  const currentDayIndex = new Date().getDay();
  const isCurrentWeek = isSameDay(currentWeekStart, startOfWeek(new Date(), { weekStartsOn: 0 }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Workout Calendar</h2>
          <p className="text-gray-400">Your training schedule</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('week')}
            className={`px-4 py-2 rounded ${
              viewMode === 'week' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`px-4 py-2 rounded ${
              viewMode === 'month' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Month Heat Map View */}
      {viewMode === 'month' && (
        <>
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
            <button
              onClick={() => setCurrentMonthStart(addDays(currentMonthStart, -30))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              ← Previous Month
            </button>
            <div className="text-center">
              <p className="font-semibold">{format(currentMonthStart, 'MMMM yyyy')}</p>
            </div>
            <button
              onClick={() => setCurrentMonthStart(addDays(currentMonthStart, 30))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Next Month →
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs text-gray-400 mb-2">
                  {day}
                </div>
              ))}

              {eachDayOfInterval({
                start: startOfWeek(startOfMonth(currentMonthStart)),
                end: endOfMonth(currentMonthStart),
              }).map((date, index) => {
                const status = getWorkoutStatus(date);
                const isToday = isSameDay(date, new Date());
                const isCurrentMonth = date.getMonth() === currentMonthStart.getMonth();

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded p-2 ${getStatusColor(status)} ${
                      !isCurrentMonth ? 'opacity-30' : ''
                    } ${isToday ? 'ring-2 ring-white' : ''}`}
                  >
                    <p className="text-xs text-center">{format(date, 'd')}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                <span>Partial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-600 rounded"></div>
                <span>Skipped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                <span>Not Started</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Week Navigation */}
      {viewMode === 'week' && (
        <>
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
            <button
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              ← Previous Week
            </button>
            <div className="text-center">
              <p className="font-semibold">
                {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
              </p>
              {isCurrentWeek && <p className="text-sm text-blue-400">Current Week</p>}
        </div>
        <button
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          Next Week →
        </button>
      </div>

      {/* Weekly Overview - Desktop */}
      <div className="hidden md:grid md:grid-cols-7 gap-4">
        {weekSchedule.map((day, index) => {
          const dayWorkouts = getWorkoutsForDay(index);
          const dayDate = addDays(currentWeekStart, index);
          const isToday = isCurrentWeek && index === currentDayIndex;

          return (
            <div
              key={day.day}
              className={`${day.color} border rounded-lg p-4 ${
                isToday ? 'ring-2 ring-white' : ''
              }`}
            >
              <div className="text-center mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">{day.short}</p>
                <p className="text-sm font-semibold">{format(dayDate, 'd')}</p>
                {isToday && (
                  <p className="text-xs text-white font-semibold mt-1">Today</p>
                )}
              </div>
              <div className="text-center mb-2">
                <span className="text-3xl">{day.icon}</span>
              </div>
              <h3 className="text-sm font-semibold text-center mb-1">{day.workout}</h3>
              <p className="text-xs text-gray-400 text-center mb-3">{day.description}</p>

              {/* Show logged workouts */}
              {dayWorkouts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-green-400 font-semibold mb-2">✓ Completed</p>
                  {dayWorkouts.map((workout) => (
                    <div key={workout.id} className="bg-gray-800/50 rounded p-2 mb-2">
                      <p className="text-xs font-semibold">
                        {workout.weight}lb × {workout.sets}×{workout.reps}
                      </p>
                      <p className="text-xs text-gray-400">
                        Est. 1RM: {calculate1RM(workout.weight, workout.reps)}lb
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Overview - Mobile */}
      <div className="md:hidden space-y-3">
        {weekSchedule.map((day, index) => {
          const dayWorkouts = getWorkoutsForDay(index);
          const dayDate = addDays(currentWeekStart, index);
          const isToday = isCurrentWeek && index === currentDayIndex;

          return (
            <div
              key={day.day}
              className={`${day.color} border rounded-lg p-4 ${
                isToday ? 'ring-2 ring-white' : ''
              }`}
            >
              <div className="flex items-start gap-4 mb-3">
                <span className="text-4xl">{day.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold">{day.day}</h3>
                    <span className="text-sm text-gray-400">
                      {format(dayDate, 'MMM d')}
                    </span>
                    {isToday && (
                      <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-semibold">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-gray-200">{day.workout}</p>
                  <p className="text-xs text-gray-400 mt-1">{day.description}</p>
                </div>
              </div>

              {/* Show logged workouts */}
              {dayWorkouts.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <p className="text-xs text-green-400 font-semibold mb-2">✓ Completed Workouts</p>
                  {dayWorkouts.map((workout) => (
                    <div key={workout.id} className="bg-gray-800/50 rounded p-3 mb-2">
                      <p className="text-sm font-semibold">
                        {workout.weight}lb × {workout.sets} sets × {workout.reps} reps
                      </p>
                      <p className="text-xs text-gray-400">
                        Est. 1RM: {calculate1RM(workout.weight, workout.reps)}lb
                      </p>
                      {workout.notes && (
                        <p className="text-xs text-gray-300 mt-1 italic">"{workout.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
        </>
      )}

      {/* Squat Progression Plan */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Squat Progression Plan</h3>
        <div className="space-y-3">
          <div className="bg-gray-700 rounded p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Phase 1: Weeks 1-6</h4>
            <p className="text-sm text-gray-300">5 sets × 5 reps, working from 185lb to 210lb</p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Phase 2: Weeks 7-10</h4>
            <p className="text-sm text-gray-300">3 sets × 3 reps, working from 215lb to 235lb</p>
          </div>
          <div className="bg-gray-700 rounded p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Phase 3: Weeks 11-12</h4>
            <p className="text-sm text-gray-300">Singles, working up to 250lb</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCalendar;
