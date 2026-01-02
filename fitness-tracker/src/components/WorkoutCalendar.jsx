const WorkoutCalendar = () => {
  const weekSchedule = [
    {
      day: 'Sunday',
      short: 'Sun',
      workout: 'Basketball',
      icon: '🏀',
      color: 'bg-orange-900/30 border-orange-700',
      description: 'Skill work and dunk practice',
    },
    {
      day: 'Monday',
      short: 'Mon',
      workout: 'Zone 2 Cardio',
      icon: '🏃',
      color: 'bg-green-900/30 border-green-700',
      description: 'Easy run, 30-45 min at conversational pace',
    },
    {
      day: 'Tuesday',
      short: 'Tue',
      workout: 'Squat Day',
      icon: '🏋️',
      color: 'bg-blue-900/30 border-blue-700',
      description: 'Follow progression plan',
    },
    {
      day: 'Wednesday',
      short: 'Wed',
      workout: 'Zone 2 Cardio',
      icon: '🏃',
      color: 'bg-green-900/30 border-green-700',
      description: 'Easy run, 30-45 min at conversational pace',
    },
    {
      day: 'Thursday',
      short: 'Thu',
      workout: 'Upper Body',
      icon: '💪',
      color: 'bg-purple-900/30 border-purple-700',
      description: 'Accessory work and core',
    },
    {
      day: 'Friday',
      short: 'Fri',
      workout: 'Mile Time Trial',
      icon: '⏱️',
      color: 'bg-red-900/30 border-red-700',
      description: 'Track your mile progress',
    },
    {
      day: 'Saturday',
      short: 'Sat',
      workout: 'Active Recovery',
      icon: '🧘',
      color: 'bg-gray-700 border-gray-600',
      description: 'Stretch, yoga, or light activity',
    },
  ];

  const currentDayIndex = new Date().getDay();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Workout Calendar</h2>
        <p className="text-gray-400">Your weekly training schedule</p>
      </div>

      {/* Weekly Overview - Desktop */}
      <div className="hidden md:grid md:grid-cols-7 gap-4">
        {weekSchedule.map((day, index) => (
          <div
            key={day.day}
            className={`${day.color} border rounded-lg p-4 ${
              index === currentDayIndex ? 'ring-2 ring-white' : ''
            }`}
          >
            <div className="text-center mb-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{day.short}</p>
              {index === currentDayIndex && (
                <p className="text-xs text-white font-semibold mt-1">Today</p>
              )}
            </div>
            <div className="text-center mb-2">
              <span className="text-3xl">{day.icon}</span>
            </div>
            <h3 className="text-sm font-semibold text-center mb-1">{day.workout}</h3>
            <p className="text-xs text-gray-400 text-center">{day.description}</p>
          </div>
        ))}
      </div>

      {/* Weekly Overview - Mobile */}
      <div className="md:hidden space-y-3">
        {weekSchedule.map((day, index) => (
          <div
            key={day.day}
            className={`${day.color} border rounded-lg p-4 ${
              index === currentDayIndex ? 'ring-2 ring-white' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{day.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{day.day}</h3>
                  {index === currentDayIndex && (
                    <span className="bg-white text-gray-900 text-xs px-2 py-1 rounded-full font-semibold">
                      Today
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-200">{day.workout}</p>
                <p className="text-xs text-gray-400 mt-1">{day.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training Notes */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Training Notes</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Squat Progression</h4>
            <ul className="space-y-1 text-sm text-gray-300 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Weeks 1-6: 5×5 working up from 185lb to 210lb</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Weeks 7-10: 3×3 working from 215lb to 235lb</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">•</span>
                <span>Weeks 11-12: Singles working to 250lb</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-green-400 mb-2">Zone 2 Guidelines</h4>
            <ul className="space-y-1 text-sm text-gray-300 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Maintain conversational pace - you should be able to talk comfortably</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Keep HR around 60-70% of max (roughly 120-140 bpm)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">•</span>
                <span>Build aerobic base for better mile performance</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-red-400 mb-2">Mile Strategy</h4>
            <ul className="space-y-1 text-sm text-gray-300 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Week 8 target: 7:30-7:45</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Week 16 target: Sub-7:00</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>Account for Denver altitude - adjust expectations on outdoor runs</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-orange-400 mb-2">Basketball Focus</h4>
            <ul className="space-y-1 text-sm text-gray-300 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-orange-400">•</span>
                <span>Work on approach and timing for dunks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">•</span>
                <span>Practice explosiveness and rotation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400">•</span>
                <span>360 attempts unlock at 235lb squat</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Recovery Tips */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recovery Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 bg-gray-700 rounded">
            <span className="text-2xl">💧</span>
            <div>
              <p className="font-semibold text-sm">Hydration</p>
              <p className="text-xs text-gray-400">Stay hydrated, especially at altitude</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-700 rounded">
            <span className="text-2xl">😴</span>
            <div>
              <p className="font-semibold text-sm">Sleep</p>
              <p className="text-xs text-gray-400">8+ hours for optimal recovery</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-700 rounded">
            <span className="text-2xl">🍗</span>
            <div>
              <p className="font-semibold text-sm">Nutrition</p>
              <p className="text-xs text-gray-400">Adequate protein for muscle building</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-700 rounded">
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-semibold text-sm">Track Metrics</p>
              <p className="text-xs text-gray-400">Log HRV, RHR weekly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCalendar;
