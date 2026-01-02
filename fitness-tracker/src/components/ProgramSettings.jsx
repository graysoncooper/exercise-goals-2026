import { useState } from 'react';
import { format, parseISO, addWeeks } from 'date-fns';
import { useProgramWeek } from '../hooks/useProgramWeek';

const ProgramSettings = () => {
  const { currentWeek, isConfigured, startDate, setStartDate, getCurrentPhase } = useProgramWeek();
  const [inputDate, setInputDate] = useState(startDate || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStartDate(inputDate);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the program start date? This will restart from Week 1.')) {
      setStartDate(null);
      setInputDate('');
    }
  };

  const getEndDate = () => {
    if (!startDate) return null;
    return addWeeks(parseISO(startDate), 12);
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'build':
        return 'text-blue-400';
      case 'strength':
        return 'text-purple-400';
      case 'peak':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPhaseDescription = (phase) => {
    switch (phase) {
      case 'build':
        return '5×5 Linear Progression';
      case 'strength':
        return '3×3 Intensity Phase';
      case 'peak':
        return 'Peaking & Testing';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Program Settings</h2>

      {!isConfigured ? (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Set Program Start Date</h3>
          <p className="text-gray-400 mb-6">
            Choose the date when you want to start your 12-week program. This will automatically
            calculate your current week and set target weights based on the progression matrix.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Program Start Date</label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Tip: Choose a Monday for Week 1 to align with the weekly schedule
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded transition-colors"
            >
              Start 12-Week Program
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-700 rounded">
            <h4 className="font-semibold mb-2">Program Overview</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Weeks 1-6: Build Phase (5×5 Linear, 185-210lb)</li>
              <li>• Weeks 7-10: Strength Phase (3×3 Intensity, 215-235lb)</li>
              <li>• Weeks 11-12: Peak Phase (Singles, 240-250lb)</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {showSuccess && (
            <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
              <p className="text-green-400 font-semibold">✓ Program settings updated successfully!</p>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Current Progress</h3>
              <button
                onClick={handleReset}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Reset Program
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Current Week</p>
                <p className="text-3xl font-bold text-blue-400">Week {currentWeek}</p>
                <p className="text-xs text-gray-500 mt-1">of 12</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Current Phase</p>
                <p className={`text-2xl font-bold ${getPhaseColor(getCurrentPhase())}`}>
                  {getCurrentPhase().charAt(0).toUpperCase() + getCurrentPhase().slice(1)}
                </p>
                <p className="text-xs text-gray-400 mt-1">{getPhaseDescription(getCurrentPhase())}</p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Progress</p>
                <p className="text-2xl font-bold">{Math.round((currentWeek / 12) * 100)}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  {12 - currentWeek} week{12 - currentWeek !== 1 ? 's' : ''} remaining
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(currentWeek / 12) * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-700 rounded p-3">
                <p className="text-gray-400 mb-1">Program Start Date</p>
                <p className="font-semibold">{format(parseISO(startDate), 'MMMM d, yyyy')}</p>
              </div>
              <div className="bg-gray-700 rounded p-3">
                <p className="text-gray-400 mb-1">Program End Date</p>
                <p className="font-semibold">{format(getEndDate(), 'MMMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Update Start Date</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Need to adjust your program start date? Update it below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-4">
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="flex-1 bg-gray-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded transition-colors"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramSettings;
