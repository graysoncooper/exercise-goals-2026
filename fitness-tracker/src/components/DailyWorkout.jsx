import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useProgramWeek } from '../hooks/useProgramWeek';
import { storage } from '../utils/storage';
import {
  EXERCISE_LIBRARY,
  DAY_KEYS,
  BLOCK_CONFIG,
  getTargetWeight,
  getSquatTarget,
  getRunningTarget,
} from '../utils/programData';

const DailyWorkout = ({ onOpenExercise }) => {
  const { currentWeek, isConfigured } = useProgramWeek();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutLog, setWorkoutLog] = useState(null);
  const [completedExercises, setCompletedExercises] = useState(new Set());

  const dayOfWeek = new Date(selectedDate).getDay();
  const dayKey = DAY_KEYS[dayOfWeek];
  const dayWorkout = EXERCISE_LIBRARY[dayKey];

  useEffect(() => {
    loadWorkoutLog();
  }, [selectedDate]);

  const loadWorkoutLog = () => {
    const log = storage.getWorkoutLogByDate(selectedDate);
    setWorkoutLog(log);

    if (log) {
      const completed = new Set(
        log.exercises
          .filter(e => !e.skipped && e.loggedSets.length > 0)
          .map(e => e.exerciseId)
      );
      setCompletedExercises(completed);
    } else {
      setCompletedExercises(new Set());
    }
  };

  const startWorkout = () => {
    if (!workoutLog) {
      const newLog = storage.addWorkoutLog({
        date: selectedDate,
        weekNumber: currentWeek,
        dayType: dayKey,
        startTime: new Date().toISOString(),
        exercises: dayWorkout.exercises.map(ex => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          programmedSets: ex.sets,
          programmedReps: ex.reps,
          programmedWeight: getTargetWeight(ex, currentWeek),
          loggedSets: [],
          skipped: false,
        })),
        completed: false,
      });
      setWorkoutLog(newLog);
    }
  };

  const groupExercisesByBlock = () => {
    const grouped = {};
    dayWorkout.exercises.forEach(ex => {
      if (!grouped[ex.block]) {
        grouped[ex.block] = [];
      }
      grouped[ex.block].push(ex);
    });
    return grouped;
  };

  const handleExerciseClick = (exercise) => {
    if (!workoutLog) {
      startWorkout();
    }
    if (onOpenExercise) {
      onOpenExercise(exercise, workoutLog);
    }
  };

  const getTotalExercises = () => {
    return dayWorkout.exercises.length;
  };

  const getCompletedCount = () => {
    return completedExercises.size;
  };

  const getProgressPercentage = () => {
    const total = getTotalExercises();
    const completed = getCompletedCount();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getLastWeekPerformance = (exerciseId) => {
    // Get workout logs from last week for the same day
    const logs = storage.getWorkoutLogs();
    const lastWeekLogs = logs
      .filter(log => log.dayType === dayKey && log.weekNumber === currentWeek - 1)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (lastWeekLogs.length === 0) return null;

    const lastLog = lastWeekLogs[0];
    const exercise = lastLog.exercises.find(e => e.exerciseId === exerciseId);
    return exercise;
  };

  if (!isConfigured) {
    return (
      <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2 text-yellow-400">⚠️ Program Not Configured</h3>
        <p className="text-gray-300 mb-4">
          Please set your program start date in Program Settings to see your daily workouts with correct target weights.
        </p>
      </div>
    );
  }

  if (!dayWorkout) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-400">No workout scheduled for this day.</p>
      </div>
    );
  }

  const groupedExercises = groupExercisesByBlock();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{format(new Date(selectedDate), 'EEEE, MMM d')}</h2>
          <p className="text-gray-400">{dayWorkout.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Week {currentWeek} of 12</p>
          <p className="text-sm text-gray-400">Est. time: {dayWorkout.duration}m</p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-gray-800 rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Workout Progress</span>
          <span className="text-sm text-gray-400">
            {getCompletedCount()} / {getTotalExercises()}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Exercise Blocks */}
      {Object.entries(groupedExercises).map(([block, exercises]) => {
        const blockConfig = BLOCK_CONFIG[block] || { name: block, color: 'bg-gray-800', icon: '📋' };

        return (
          <div key={block} className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{blockConfig.icon}</span>
              <h3 className="text-xl font-semibold">{blockConfig.name.toUpperCase()}</h3>
            </div>

            <div className="space-y-3">
              {exercises.map((exercise) => {
                const targetWeight = getTargetWeight(exercise, currentWeek);
                const isCompleted = completedExercises.has(exercise.id);
                const lastWeek = getLastWeekPerformance(exercise.id);

                // Special handling for squat to show sets/reps from matrix
                let displaySets = exercise.sets;
                let displayReps = exercise.reps;
                if (exercise.id === 'thu-main-1') {
                  const squatTarget = getSquatTarget(currentWeek);
                  displaySets = squatTarget.sets;
                  displayReps = squatTarget.reps;
                }

                // Special handling for running intervals
                if (exercise.id === 'fri-main-1') {
                  const runTarget = getRunningTarget(currentWeek);
                  if (runTarget.test) {
                    return (
                      <div
                        key={exercise.id}
                        className={`${blockConfig.color} border rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-colors`}
                        onClick={() => handleExerciseClick(exercise)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xl ${isCompleted ? '✓ text-green-400' : '○ text-gray-500'}`}>
                                {isCompleted ? '✓' : '○'}
                              </span>
                              <p className="font-semibold">{exercise.name}</p>
                            </div>
                            <p className="text-sm text-yellow-400 ml-8 mt-1">
                              Mile Time Trial • Target: {runTarget.test}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                }

                return (
                  <div
                    key={exercise.id}
                    className={`${blockConfig.color} border rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-colors ${
                      isCompleted ? 'opacity-75' : ''
                    }`}
                    onClick={() => handleExerciseClick(exercise)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xl ${isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                            {isCompleted ? '✓' : '○'}
                          </span>
                          <p className="font-semibold">{exercise.name}</p>
                        </div>

                        <div className="ml-8 mt-1 space-y-1">
                          <p className="text-sm text-gray-300">
                            {displaySets}×{displayReps}
                            {targetWeight !== null && targetWeight > 0 && ` @ ${targetWeight} lb`}
                            {targetWeight !== null && targetWeight === 0 && ' @ BW'}
                          </p>

                          {exercise.id === 'thu-main-1' && (
                            <p className="text-xs text-blue-400">
                              Target 1RM: {getSquatTarget(currentWeek).est1RM} lb
                            </p>
                          )}

                          {exercise.id === 'fri-main-1' && getRunningTarget(currentWeek).intervalSpeed && (
                            <p className="text-xs text-blue-400">
                              {getRunningTarget(currentWeek).intervalSpeed} mph × {getRunningTarget(currentWeek).rounds} rounds
                            </p>
                          )}

                          {lastWeek && lastWeek.loggedSets.length > 0 && (
                            <p className="text-xs text-purple-400">
                              ↑ Last week: {lastWeek.loggedSets[0].weight}lb × {lastWeek.loggedSets[0].reps}
                            </p>
                          )}

                          {exercise.notes && (
                            <p className="text-xs text-gray-500 italic">{exercise.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Steam Room Reminder */}
      {dayWorkout.steamRoom && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♨️</span>
            <div>
              <p className="font-semibold">Post-Workout Recovery</p>
              <p className="text-sm text-gray-400">Steam Room: 20-25 minutes</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!workoutLog && (
        <button
          onClick={startWorkout}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
        >
          Start Workout
        </button>
      )}

      {workoutLog && !workoutLog.completed && (
        <button
          onClick={() => {
            storage.updateWorkoutLog(workoutLog.id, {
              completed: true,
              endTime: new Date().toISOString(),
            });
            loadWorkoutLog();
          }}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-lg transition-colors text-lg"
        >
          Complete Workout
        </button>
      )}

      {workoutLog && workoutLog.completed && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center">
          <p className="text-green-400 font-semibold text-lg">✓ Workout Completed!</p>
          <p className="text-sm text-gray-400 mt-1">
            {format(new Date(workoutLog.endTime), 'h:mm a')}
          </p>
        </div>
      )}
    </div>
  );
};

export default DailyWorkout;
