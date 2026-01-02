// 12-Week Program Data

// Squat progression matrix
export const SQUAT_PROGRESSION = [
  { week: 1, protocol: 'Linear', weight: 185, sets: 5, reps: 5, est1RM: 214, phase: 'build' },
  { week: 2, protocol: 'Linear', weight: 190, sets: 5, reps: 5, est1RM: 220, phase: 'build' },
  { week: 3, protocol: 'Linear', weight: 195, sets: 5, reps: 5, est1RM: 226, phase: 'build' },
  { week: 4, protocol: 'Linear', weight: 200, sets: 5, reps: 5, est1RM: 231, phase: 'build' },
  { week: 5, protocol: 'Linear', weight: 205, sets: 5, reps: 5, est1RM: 237, phase: 'build' },
  { week: 6, protocol: 'Linear', weight: 210, sets: 5, reps: 5, est1RM: 243, phase: 'build' },
  { week: 7, protocol: 'Intensity', weight: 215, sets: 3, reps: 3, est1RM: 226, phase: 'strength' },
  { week: 8, protocol: 'Intensity', weight: 220, sets: 3, reps: 3, est1RM: 231, phase: 'strength' },
  { week: 9, protocol: 'Intensity', weight: 225, sets: 3, reps: 3, est1RM: 236, phase: 'strength' },
  { week: 10, protocol: 'Intensity', weight: 235, sets: 3, reps: 3, est1RM: 247, phase: 'strength' },
  { week: 11, protocol: 'Peaking', weight: 240, sets: 2, reps: 2, est1RM: 256, phase: 'peak' },
  { week: 12, protocol: 'Peaking', weight: 245, sets: 1, reps: 1, est1RM: 250, phase: 'peak' },
];

// Running progression matrix
export const RUNNING_PROGRESSION = [
  { week: 1, intervalSpeed: 7.5, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 2, intervalSpeed: 7.5, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 3, intervalSpeed: 7.6, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 4, intervalSpeed: 7.6, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 5, intervalSpeed: 7.7, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 6, intervalSpeed: 7.7, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 7, intervalSpeed: 7.8, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 8, intervalSpeed: null, recovery: null, rounds: null, duration: null, test: '7:30-7:45' },
  { week: 9, intervalSpeed: 7.9, recovery: 4.5, rounds: 4, duration: 4 },
  { week: 10, intervalSpeed: 7.9, recovery: 4.5, rounds: 5, duration: 4 },
  { week: 11, intervalSpeed: 8.0, recovery: 4.5, rounds: 5, duration: 4 },
  { week: 12, intervalSpeed: 8.0, recovery: 4.5, rounds: 5, duration: 4 },
];

// Accessory progression matrix
export const ACCESSORY_PROGRESSION = {
  singleLegRDL: [20, 20, 25, 30, 35, 35, 40, 40, 45, 45, 50, 50],
  hipThrust: [270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 315, 320],
  backExtension: [0, 0, 10, 10, 15, 15, 20, 20, 25, 25, 25, 30],
  bulgarianSplit: [90, 90, 95, 95, 100, 100, 105, 105, 110, 110, 115, 115],
};

// Exercise library organized by day
export const EXERCISE_LIBRARY = {
  monday: {
    name: 'Zone 2 + KOT + Mobility',
    duration: 55,
    steamRoom: false,
    exercises: [
      {
        id: 'mon-cardio',
        name: 'Treadmill Run',
        block: 'cardio',
        sets: 1,
        reps: '30-35 min',
        weight: null,
        notes: 'HR 130-145, 1-2% incline',
      },
      {
        id: 'mon-kot-1',
        name: 'KOT Split Squat',
        block: 'kot',
        sets: 2,
        reps: '8 each',
        weight: 0,
        notes: 'Knee over toes',
      },
      {
        id: 'mon-kot-2',
        name: 'FHL Calf Raise',
        block: 'kot',
        sets: 2,
        reps: '12 each',
        weight: 0,
        notes: 'Big toe emphasis',
      },
      {
        id: 'mon-mob-1',
        name: '90/90 Hip Switches',
        block: 'mobility',
        sets: 1,
        reps: '10 each',
        weight: null,
      },
      {
        id: 'mon-mob-2',
        name: 'Couch Stretch',
        block: 'mobility',
        sets: 1,
        reps: '90 sec each',
        weight: null,
      },
      {
        id: 'mon-mob-3',
        name: "World's Greatest Stretch",
        block: 'mobility',
        sets: 1,
        reps: '5 each',
        weight: null,
      },
      {
        id: 'mon-mob-4',
        name: 'Quadruped T-Spine Rotation',
        block: 'mobility',
        sets: 1,
        reps: '10 each',
        weight: null,
      },
      {
        id: 'mon-mob-5',
        name: 'Shoulder ER/IR Band',
        block: 'mobility',
        sets: 3,
        reps: '10',
        weight: null,
        notes: 'Rehab',
      },
      {
        id: 'mon-mob-6',
        name: 'Foam Roll Quads/Adductors',
        block: 'mobility',
        sets: 1,
        reps: '2 min each',
        weight: null,
      },
    ],
  },
  tuesday: {
    name: 'Lower Hypertrophy',
    duration: 50,
    steamRoom: true,
    exercises: [
      {
        id: 'tue-main-1',
        name: '45° Back Extension',
        block: 'main',
        sets: 4,
        reps: 12,
        weight: 0,
        progression: { type: 'biweekly', increment: 5 },
        notes: '+5 lb/2 weeks',
      },
      {
        id: 'tue-main-2',
        name: 'Single-Leg RDL (DB)',
        block: 'main',
        sets: 3,
        reps: '8 each',
        weight: 20,
        progression: { type: 'matrix', key: 'singleLegRDL' },
        notes: 'See matrix',
      },
      {
        id: 'tue-main-3',
        name: 'Hip Thrust',
        block: 'main',
        sets: 4,
        reps: 12,
        weight: 270,
        progression: { type: 'matrix', key: 'hipThrust' },
        notes: '+5 lb/week',
      },
      {
        id: 'tue-main-4',
        name: 'Lying Hamstring Curl',
        block: 'main',
        sets: 3,
        reps: 12,
        weight: 130,
        progression: { type: 'custom', increment: 10, weeksPerIncrement: 3 },
        notes: '+10 lb/3 weeks',
      },
      {
        id: 'tue-calves-1',
        name: 'Seated Calf Raise',
        block: 'calves',
        sets: 4,
        reps: 15,
        weight: 130,
        progression: { type: 'biweekly', increment: 10 },
        notes: '+10 lb/2 weeks',
      },
      {
        id: 'tue-calves-2',
        name: 'Standing Calf Raise',
        block: 'calves',
        sets: 3,
        reps: 12,
        weight: 150,
        progression: { type: 'biweekly', increment: 10 },
        notes: '+10 lb/2 weeks',
      },
      {
        id: 'tue-acc-1',
        name: 'Hip Adduction',
        block: 'accessory',
        sets: 3,
        reps: 15,
        weight: 120,
        progression: { type: 'custom', increment: 10, weeksPerIncrement: 4 },
        notes: '+10 lb/4 weeks',
      },
      {
        id: 'tue-acc-2',
        name: 'Hip Abduction',
        block: 'accessory',
        sets: 3,
        reps: 15,
        weight: 90,
        progression: { type: 'custom', increment: 10, weeksPerIncrement: 4 },
        notes: '+10 lb/4 weeks',
      },
    ],
  },
  wednesday: {
    name: 'Core + Upper Body',
    duration: 45,
    steamRoom: false,
    exercises: [
      {
        id: 'wed-core-1',
        name: 'Cable Pallof Press',
        block: 'core',
        sets: 3,
        reps: '12 each',
        weight: 30,
        notes: 'Anti-rotation',
      },
      {
        id: 'wed-core-2',
        name: 'Med Ball Rotational Slam',
        block: 'core',
        sets: 3,
        reps: '8 each',
        weight: 15,
        notes: 'Explosive',
      },
      {
        id: 'wed-core-3',
        name: "Captain's Chair Leg Raise",
        block: 'core',
        sets: 3,
        reps: 12,
        weight: 0,
        notes: 'Slow',
      },
      {
        id: 'wed-core-4',
        name: 'Dead Bug',
        block: 'core',
        sets: 3,
        reps: '10 each',
        weight: 0,
        notes: 'Anti-extension',
      },
      {
        id: 'wed-core-5',
        name: 'Plank',
        block: 'core',
        sets: 2,
        reps: '45 sec',
        weight: 0,
      },
      {
        id: 'wed-upper-1',
        name: 'Lat Pulldown (neutral)',
        block: 'upper',
        sets: 4,
        reps: 10,
        weight: 70,
        notes: '70-85 lb',
      },
      {
        id: 'wed-upper-2',
        name: 'Seated Cable Row',
        block: 'upper',
        sets: 4,
        reps: 12,
        weight: 50,
        notes: '50-60 lb',
      },
      {
        id: 'wed-upper-3',
        name: 'Face Pulls',
        block: 'upper',
        sets: 3,
        reps: 15,
        weight: 20,
        notes: 'Posterior delt, 20-30 lb',
      },
      {
        id: 'wed-upper-4',
        name: 'Bicep Curl',
        block: 'upper',
        sets: 3,
        reps: 10,
        weight: 25,
        notes: '25-30 lb',
      },
      {
        id: 'wed-rehab-1',
        name: 'ER/IR + Sword Pulls',
        block: 'upper',
        sets: 3,
        reps: 12,
        weight: 10,
        notes: 'Shoulder maintenance',
      },
    ],
  },
  thursday: {
    name: 'Squat Strength',
    duration: 60,
    steamRoom: true,
    exercises: [
      {
        id: 'thu-warm-1',
        name: 'Bike',
        block: 'warmup',
        sets: 1,
        reps: '5 min',
        weight: null,
      },
      {
        id: 'thu-warm-2',
        name: 'Goblet Squat',
        block: 'warmup',
        sets: 2,
        reps: 10,
        weight: 35,
      },
      {
        id: 'thu-warm-3',
        name: 'Glute Bridges',
        block: 'warmup',
        sets: 2,
        reps: 10,
        weight: 0,
      },
      {
        id: 'thu-kot-1',
        name: 'Tibialis Raise',
        block: 'kot',
        sets: 2,
        reps: 20,
        weight: 0,
      },
      {
        id: 'thu-kot-2',
        name: 'KOT Split Squat',
        block: 'kot',
        sets: 2,
        reps: '8 each',
        weight: 0,
      },
      {
        id: 'thu-kot-3',
        name: 'Reverse Nordic',
        block: 'kot',
        sets: 2,
        reps: 6,
        weight: 0,
        notes: 'Eccentric',
      },
      {
        id: 'thu-main-1',
        name: 'Back Squat',
        block: 'main',
        sets: 5,
        reps: 5,
        weight: 185,
        progression: { type: 'matrix', key: 'squat' },
        notes: 'See matrix',
      },
      {
        id: 'thu-acc-1',
        name: 'Hack Squat',
        block: 'accessory',
        sets: 3,
        reps: 8,
        weight: 160,
        progression: { type: 'biweekly', increment: 10 },
        notes: '+10 lb/2 weeks',
      },
      {
        id: 'thu-acc-2',
        name: 'Bulgarian Split Squat',
        block: 'accessory',
        sets: 3,
        reps: '6 each',
        weight: 90,
        progression: { type: 'matrix', key: 'bulgarianSplit' },
        notes: 'See matrix',
      },
      {
        id: 'thu-acc-3',
        name: 'Leg Press',
        block: 'accessory',
        sets: 3,
        reps: 10,
        weight: 230,
        progression: { type: 'biweekly', increment: 20 },
        notes: '+20 lb/2 weeks',
      },
      {
        id: 'thu-acc-4',
        name: 'Slow Quad Extension',
        block: 'accessory',
        sets: 3,
        reps: 8,
        weight: 80,
        notes: '3 sec negative',
      },
    ],
  },
  friday: {
    name: 'VO2max Intervals',
    duration: 35,
    steamRoom: true,
    exercises: [
      {
        id: 'fri-warm-1',
        name: 'Easy Jog',
        block: 'warmup',
        sets: 1,
        reps: '5 min',
        weight: null,
        notes: '5.0 mph',
      },
      {
        id: 'fri-warm-2',
        name: 'Dynamic Stretches',
        block: 'warmup',
        sets: 1,
        reps: '3 min',
        weight: null,
        notes: 'Leg swings, high knees',
      },
      {
        id: 'fri-main-1',
        name: 'Hard Interval',
        block: 'main',
        sets: 4,
        reps: '4 min',
        weight: null,
        progression: { type: 'matrix', key: 'running' },
        notes: '1% incline',
      },
      {
        id: 'fri-main-2',
        name: 'Recovery Walk',
        block: 'main',
        sets: 4,
        reps: '3 min',
        weight: null,
        notes: '4.5 mph between intervals',
      },
      {
        id: 'fri-cool-1',
        name: 'Walk',
        block: 'cooldown',
        sets: 1,
        reps: '5 min',
        weight: null,
        notes: '3.5 mph',
      },
    ],
  },
  saturday: {
    name: 'Active Recovery',
    duration: 45,
    steamRoom: false,
    exercises: [
      {
        id: 'sat-rec-1',
        name: 'Walk',
        block: 'recovery',
        sets: 1,
        reps: '30-45 min',
        weight: null,
        notes: 'Outdoor preferred',
      },
      {
        id: 'sat-rec-2',
        name: 'Foam Roll Full Body',
        block: 'recovery',
        sets: 1,
        reps: '10-15 min',
        weight: null,
      },
      {
        id: 'sat-rec-3',
        name: 'Static Stretching',
        block: 'recovery',
        sets: 1,
        reps: '10 min',
        weight: null,
        notes: 'Hips, ankles, t-spine',
      },
    ],
  },
  sunday: {
    name: 'Basketball',
    duration: 90,
    steamRoom: false,
    exercises: [
      {
        id: 'sun-main-1',
        name: 'Basketball',
        block: 'main',
        sets: 1,
        reps: '90 min',
        weight: null,
        notes: '8:30-10:00am',
      },
      {
        id: 'sun-post-1',
        name: 'Walk Cooldown',
        block: 'recovery',
        sets: 1,
        reps: '10 min',
        weight: null,
      },
    ],
  },
};

// Block display configuration
export const BLOCK_CONFIG = {
  warmup: { name: 'Warmup', color: 'bg-yellow-900/30 border-yellow-700', icon: '🔥' },
  kot: { name: 'KOT', color: 'bg-purple-900/30 border-purple-700', icon: '🦵' },
  main: { name: 'Main Lift', color: 'bg-blue-900/30 border-blue-700', icon: '💪' },
  accessory: { name: 'Accessories', color: 'bg-green-900/30 border-green-700', icon: '🏋️' },
  core: { name: 'Core', color: 'bg-orange-900/30 border-orange-700', icon: '🎯' },
  upper: { name: 'Upper Body', color: 'bg-indigo-900/30 border-indigo-700', icon: '💪' },
  calves: { name: 'Calves', color: 'bg-pink-900/30 border-pink-700', icon: '🦿' },
  cardio: { name: 'Cardio', color: 'bg-red-900/30 border-red-700', icon: '🏃' },
  mobility: { name: 'Mobility', color: 'bg-teal-900/30 border-teal-700', icon: '🧘' },
  recovery: { name: 'Recovery', color: 'bg-gray-700 border-gray-600', icon: '💆' },
  cooldown: { name: 'Cooldown', color: 'bg-cyan-900/30 border-cyan-700', icon: '❄️' },
};

// Get target weight for an exercise based on week number
export const getTargetWeight = (exercise, weekNumber) => {
  if (!exercise.progression) {
    return exercise.weight;
  }

  const { type, key, increment, weeksPerIncrement } = exercise.progression;

  switch (type) {
    case 'matrix':
      if (key === 'squat') {
        const squatData = SQUAT_PROGRESSION.find(p => p.week === weekNumber);
        return squatData ? squatData.weight : exercise.weight;
      }
      if (key === 'running') {
        const runData = RUNNING_PROGRESSION.find(p => p.week === weekNumber);
        return runData?.intervalSpeed || null;
      }
      if (ACCESSORY_PROGRESSION[key]) {
        return ACCESSORY_PROGRESSION[key][weekNumber - 1] || exercise.weight;
      }
      return exercise.weight;

    case 'weekly':
      return exercise.weight + increment * (weekNumber - 1);

    case 'biweekly':
      return exercise.weight + increment * Math.floor((weekNumber - 1) / 2);

    case 'custom':
      return exercise.weight + increment * Math.floor((weekNumber - 1) / weeksPerIncrement);

    default:
      return exercise.weight;
  }
};

// Get target sets/reps for squat based on week
export const getSquatTarget = (weekNumber) => {
  return SQUAT_PROGRESSION.find(p => p.week === weekNumber) || SQUAT_PROGRESSION[0];
};

// Get running target based on week
export const getRunningTarget = (weekNumber) => {
  return RUNNING_PROGRESSION.find(p => p.week === weekNumber) || RUNNING_PROGRESSION[0];
};

// Day name to key mapping
export const DAY_KEYS = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};
