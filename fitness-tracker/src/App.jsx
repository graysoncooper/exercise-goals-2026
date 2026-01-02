import { useState, useEffect } from 'react';
import { storage } from './utils/storage';
import Dashboard from './components/Dashboard';
import WorkoutTracker from './components/WorkoutTracker';
import WorkoutCalendar from './components/WorkoutCalendar';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Initialize storage on first load
    storage.initialize();
  }, []);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'workouts', label: 'Workouts', icon: '💪' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'workouts':
        return <WorkoutTracker />;
      case 'calendar':
        return <WorkoutCalendar />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">6-Month Fitness Goals</h1>
          <p className="text-gray-400 text-sm">Track your journey to greatness</p>
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
          <p>Stay consistent. Track progress. Achieve goals. 💪</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
