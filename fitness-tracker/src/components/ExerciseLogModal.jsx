import { useState, useEffect, useRef } from 'react';
import { storage } from '../utils/storage';

const ExerciseLogModal = ({ isOpen, onClose, exercise, workoutLog, currentWeek, onSave }) => {
  const [sets, setSets] = useState([]);
  const [currentSet, setCurrentSet] = useState(0);
  const [restTimer, setRestTimer] = useState(null);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [notes, setNotes] = useState('');
  const timerRef = useRef(null);

  // Default rest times by block type
  const getDefaultRestTime = () => {
    if (!exercise) return 90;
    if (exercise.block === 'main') return 180; // 3 minutes for main lifts
    if (exercise.block === 'accessory') return 90; // 90 seconds for accessories
    if (exercise.block === 'warmup' || exercise.block === 'mobility') return 30;
    return 60;
  };

  useEffect(() => {
    if (isOpen && exercise) {
      initializeSets();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen, exercise]);

  useEffect(() => {
    if (restSecondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playAlertSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [restSecondsLeft]);

  const initializeSets = () => {
    // Check if exercise already has logged sets in the workout
    const exerciseLog = workoutLog?.exercises.find(e => e.exerciseId === exercise.id);

    if (exerciseLog && exerciseLog.loggedSets.length > 0) {
      setSets(exerciseLog.loggedSets.map(s => ({
        weight: s.weight,
        reps: s.reps,
        completed: true,
      })));
      setCurrentSet(exerciseLog.loggedSets.length);
      setNotes(exerciseLog.notes || '');
    } else {
      // Initialize empty sets based on programmed sets
      const targetWeight = exercise.weight;
      const initialSets = Array.from({ length: exercise.sets }, () => ({
        weight: targetWeight,
        reps: typeof exercise.reps === 'number' ? exercise.reps : 0,
        completed: false,
      }));
      setSets(initialSets);
      setCurrentSet(0);
    }
  };

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets];
    newSets[index][field] = value === '' ? '' : Number(value);
    setSets(newSets);
  };

  const completeSet = (index) => {
    const newSets = [...sets];
    newSets[index].completed = true;
    setSets(newSets);

    // Start rest timer if not last set
    if (index < sets.length - 1) {
      setRestSecondsLeft(getDefaultRestTime());
      setCurrentSet(index + 1);
    } else {
      setCurrentSet(index + 1);
    }
  };

  const skipRestTimer = () => {
    setRestSecondsLeft(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const playAlertSound = () => {
    // Simple beep using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (!workoutLog) return;

    // Update the workout log with the completed sets
    const exerciseLog = workoutLog.exercises.find(e => e.exerciseId === exercise.id);
    if (exerciseLog) {
      exerciseLog.loggedSets = sets
        .filter(s => s.completed)
        .map((s, idx) => ({
          setNumber: idx + 1,
          weight: s.weight,
          reps: s.reps,
          completedAt: new Date().toISOString(),
        }));
      exerciseLog.notes = notes;
      exerciseLog.skipped = false;

      storage.updateWorkoutLog(workoutLog.id, workoutLog);

      if (onSave) {
        onSave();
      }
    }

    onClose();
  };

  const handleSkip = () => {
    if (!workoutLog) return;

    const exerciseLog = workoutLog.exercises.find(e => e.exerciseId === exercise.id);
    if (exerciseLog) {
      exerciseLog.skipped = true;
      exerciseLog.notes = notes || 'Skipped';
      storage.updateWorkoutLog(workoutLog.id, workoutLog);

      if (onSave) {
        onSave();
      }
    }

    onClose();
  };

  if (!isOpen || !exercise) return null;

  const completedSets = sets.filter(s => s.completed).length;
  const targetWeight = exercise.weight;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{exercise.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-400">
              Target: {exercise.sets}×{exercise.reps}
              {targetWeight !== null && targetWeight > 0 && ` @ ${targetWeight} lb`}
            </p>
            <p className="text-blue-400">
              {completedSets} / {sets.length} sets
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Rest Timer */}
          {restSecondsLeft > 0 && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Rest Timer</p>
                  <p className="text-3xl font-bold text-blue-400">{formatTime(restSecondsLeft)}</p>
                </div>
                <button
                  onClick={skipRestTimer}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          {/* Sets */}
          <div className="space-y-3">
            {sets.map((set, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  set.completed
                    ? 'bg-green-900/20 border-green-700'
                    : index === currentSet
                    ? 'bg-blue-900/20 border-blue-700'
                    : 'bg-gray-700 border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-2xl ${set.completed ? 'text-green-400' : 'text-gray-500'}`}>
                      {set.completed ? '✓' : '○'}
                    </span>
                    <span className="text-lg font-semibold">Set {index + 1}</span>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Weight (lb)</label>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                        disabled={set.completed}
                        className="w-full bg-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Reps</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                        disabled={set.completed}
                        className="w-full bg-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {!set.completed && index === currentSet && (
                    <button
                      onClick={() => completeSet(index)}
                      disabled={!set.weight || !set.reps}
                      className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
              placeholder="How did it feel? Any adjustments needed?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded font-semibold"
            >
              Skip Exercise
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded font-semibold"
            >
              Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLogModal;
