import { useState, useEffect } from 'react';
import { useDunkAttempts } from '../hooks/useStorage';
import { storage } from '../utils/storage';
import { format } from 'date-fns';

const DunkAttempts = () => {
  const { attempts, addAttempt, deleteAttempt, isUnlocked, checkUnlock } = useDunkAttempts();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    result: 'missed',
    notes: '',
  });
  const [maxSquat, setMaxSquat] = useState(0);

  useEffect(() => {
    // Get max squat weight to show progress
    const squatLogs = storage.getSquatLogs();
    if (squatLogs.length > 0) {
      const max = Math.max(...squatLogs.map(log => log.weight));
      setMaxSquat(max);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isUnlocked) return;

    addAttempt({
      date: formData.date,
      result: formData.result,
      notes: formData.notes,
    });
    setFormData({
      date: new Date().toISOString().split('T')[0],
      result: 'missed',
      notes: '',
    });
    setShowForm(false);
  };

  const hasDunked = attempts.some(a => a.result === 'made');
  const madeCount = attempts.filter(a => a.result === 'made').length;
  const missedCount = attempts.filter(a => a.result === 'missed').length;
  const successRate = attempts.length > 0 ? ((madeCount / attempts.length) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">360 Dunk Attempts</h2>
        {isUnlocked && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Cancel' : '+ Log Attempt'}
          </button>
        )}
      </div>

      {/* Unlock Status */}
      {!isUnlocked && (
        <div className="bg-gray-800 border-2 border-gray-700 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-2xl font-bold mb-2">Locked</h3>
          <p className="text-gray-400 mb-4">
            You need to reach 235lb squat to unlock dunk attempts
          </p>
          <div className="bg-gray-700 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Current Max Squat</span>
              <span className="text-2xl font-bold">{maxSquat}lb</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-4 mb-2">
              <div
                className="bg-orange-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (maxSquat / 235) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>0lb</span>
              <span className="font-semibold text-orange-400">{235 - maxSquat}lb to go</span>
              <span>235lb</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Keep training hard! You're getting closer every session.
          </p>
        </div>
      )}

      {/* Achievement Banner */}
      {hasDunked && (
        <div className="bg-gradient-to-r from-orange-900/50 to-yellow-900/50 border-2 border-orange-500 rounded-lg p-6 text-center">
          <div className="text-6xl mb-2">🎉🏀</div>
          <h3 className="text-3xl font-bold text-orange-400 mb-2">GOAL ACHIEVED!</h3>
          <p className="text-lg text-gray-300">You landed your first 360 dunk!</p>
        </div>
      )}

      {/* Stats */}
      {isUnlocked && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Attempts</p>
            <p className="text-3xl font-bold">{attempts.length}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Made</p>
            <p className="text-3xl font-bold text-green-400">{madeCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Missed</p>
            <p className="text-3xl font-bold text-red-400">{missedCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Success Rate</p>
            <p className="text-3xl font-bold">{successRate}%</p>
          </div>
        </div>
      )}

      {/* Log Form */}
      {showForm && isUnlocked && (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Result</label>
              <select
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              >
                <option value="missed">Missed</option>
                <option value="made">Made! 🎉</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
              rows="3"
              placeholder="How did it feel? What went well/wrong?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Log Attempt
          </button>
        </form>
      )}

      {/* Recent Attempts */}
      {isUnlocked && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Attempt History</h3>
          {attempts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No attempts logged yet. Time to go for it! 🏀
            </p>
          ) : (
            <div className="space-y-3">
              {[...attempts]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((attempt) => (
                  <div
                    key={attempt.id}
                    className={`rounded-lg p-4 ${
                      attempt.result === 'made'
                        ? 'bg-green-900/30 border border-green-700'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <p className="font-semibold">{format(new Date(attempt.date), 'MMM dd, yyyy')}</p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              attempt.result === 'made'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-gray-200'
                            }`}
                          >
                            {attempt.result === 'made' ? '✓ MADE' : '✗ MISSED'}
                          </span>
                        </div>
                        {attempt.notes && (
                          <p className="text-sm text-gray-300 mt-2">{attempt.notes}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteAttempt(attempt.id)}
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
      )}

      {/* Motivation Section */}
      {isUnlocked && !hasDunked && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Tips for Success</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Stay loose and explosive - don't overthink it</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Focus on the approach and timing your jump</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Commit to the rotation fully - hesitation kills dunks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 mt-1">•</span>
              <span>Film your attempts to analyze and improve</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DunkAttempts;
