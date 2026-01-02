import { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import WorkoutCalendar from './components/WorkoutCalendar';
import DailyWorkout from './components/DailyWorkout';
import ProgramSettings from './components/ProgramSettings';
import ProgressCharts from './components/ProgressCharts';
import ExerciseLogModal from './components/ExerciseLogModal';
import { useProgramWeek } from './hooks/useProgramWeek';

function App() {
  const [currentView, setCurrentView] = useState('today');
  const [exerciseModalOpen, setExerciseModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentWorkoutLog, setCurrentWorkoutLog] = useState(null);

  const { currentWeek } = useProgramWeek();

  useEffect(() => {
    // Initialize storage on first load
    storage.initialize();
  }, []);

  const handleOpenExercise = (exercise, workoutLog) => {
    setSelectedExercise(exercise);
    setCurrentWorkoutLog(workoutLog);
    setExerciseModalOpen(true);
  };

  const handleCloseExerciseModal = () => {
    setExerciseModalOpen(false);
    setSelectedExercise(null);
    setCurrentWorkoutLog(null);
  };

  const handleSaveExercise = () => {
    // Refresh the current view
    setCurrentView(prev => prev);
  };

  const navigation = [
    { id: 'today', label: 'Today', icon: '🎯' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'today':
        return <DailyWorkout onOpenExercise={handleOpenExercise} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'progress':
        return <ProgressCharts />;
      case 'calendar':
        return <WorkoutCalendar />;
      case 'settings':
        return <ProgramSettings />;
      case 'workouts':
        return <WorkoutTracker />;
      default:
        return <DailyWorkout onOpenExercise={handleOpenExercise} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">12-Week Fitness Program</h1>
          <p className="text-gray-400 text-sm">Week {currentWeek} • Stay consistent, track progress, achieve goals 💪</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-3 whitespace-nowrap transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
          <p>Track every rep. Trust the process. Hit your goals. 🎯</p>
        </div>
      </footer>

      {/* Exercise Log Modal */}
      <ExerciseLogModal
        isOpen={exerciseModalOpen}
        onClose={handleCloseExerciseModal}
        exercise={selectedExercise}
        workoutLog={currentWorkoutLog}
        currentWeek={currentWeek}
        onSave={handleSaveExercise}
      />
    </div>
  );
}

export default App;
