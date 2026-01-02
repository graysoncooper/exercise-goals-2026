# 6-Month Fitness Goals Tracker

A local React app to track your 6-month fitness journey toward three major goals:
- **250lb Back Squat** (starting from 185lb)
- **7:00 Mile at Denver altitude** (starting from ~7:56 pace)
- **360 Dunk** (unlocks at 235lb squat)

## Features

### Dashboard
- Real-time progress tracking for all three goals
- Visual progress bars showing completion percentage
- Latest baseline metrics (VO2 Max, HRV, Resting Heart Rate)
- Quick stats overview

### Squat Progression Tracker
- Log squat sessions with date, weight, sets, and reps
- Automatic 1RM calculation using Epley formula
- Visual chart showing weight progression over time
- Built-in progression plan:
  - Weeks 1-6: 5×5 (185lb → 210lb)
  - Weeks 7-10: 3×3 (215lb → 235lb)
  - Weeks 11-12: Singles (240lb → 250lb)

### Mile Time Tracker
- Log mile runs with time, location (treadmill/outdoor), and notes
- Track best time and latest performance
- Visual chart with goal reference line (7:00)
- Milestone checkpoints:
  - Week 8: 7:30-7:45
  - Week 16: Sub-7:00

### Weekly Metrics Logger
- Track VO2 Max, HRV, and Resting Heart Rate weekly
- Three separate trend charts for each metric
- Trend indicators showing improvement over time
- 7-day rolling average for HRV

### 360 Dunk Attempt Logger
- **Locked until you reach 235lb squat**
- Log successful and missed attempts
- Track success rate
- Achievement celebration when first dunk is made

### Workout Calendar
- Weekly training schedule at a glance
- Highlights current day
- Training notes and recovery tips

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React** - UI framework
- **Tailwind CSS** - Utility-first styling with dark mode
- **Recharts** - Data visualization
- **date-fns** - Date formatting
- **localStorage** - All data persistence (no backend needed)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Data Storage

All data is stored in your browser's localStorage, so:
- ✅ Works completely offline
- ✅ No account or login required
- ✅ Data stays on your device
- ⚠️ Clearing browser data will erase your logs
- ⚠️ Data is not synced across devices

## Mobile Responsive

The app is fully responsive and optimized for mobile viewing. The navigation automatically adapts to smaller screens, and all charts are responsive.

## Current Baseline Metrics

The app initializes with your current baseline:
- **VO2 Max**: 51
- **HRV**: 47ms
- **Resting Heart Rate**: 60bpm
- **Current Squat**: 185lb (5×5 starting point)
- **Mile Baseline**: ~7:56 pace

## License

This is a personal fitness tracker. Feel free to customize for your own goals!
