# Uma Musume Race Schedule Calculator

A React-based race scheduling tool for Uma Musume Pretty Derby's URA scenario. This application helps players plan their race schedule to maximize fan gains and achieve Legend status.

## Features

- **Visual Character Selection**: Grid-based character selector with card thumbnails
- **Smart Filtering**: Filter characters by preferred distance
- **Multi-step Wizard Flow**: Trainee info → Support deck → Career → Results
- **Distance Preference Mapping**: Auto-sets based on character, with manual override option
- **Fan Bonus Calculation**: Automatic calculation based on support card fan bonuses
- **Warning System**: Alerts when projected fans before URA Finale are below 240,000
- **Responsive UI**: Dark theme inspired by Uma Musume's in-game UI with smooth animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
uma-schedule-app/
├── src/
│   ├── components/          # React components
│   │   ├── TraineeSelection.jsx
│   │   ├── SupportDeckInput.jsx
│   │   ├── CareerSelection.jsx
│   │   └── ResultsDisplay.jsx
│   ├── data/               # Static data
│   │   └── raceData.js     # Race information
│   ├── utils/              # Utility functions
│   │   └── scheduleCalculator.js
│   ├── App.jsx             # Main app component
│   ├── App.css             # App styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint 9 flat config
└── package.json            # Dependencies
```

## How to Use

1. **Select Trainee**: Choose from a grid of Uma Musume characters (filter by distance if needed)
2. **Support Card Deck**: Input up to 6 support cards with their fan bonus percentages
3. **Select Career**: Choose URA Finale (more careers coming soon)
4. **View Results**: See your optimized race schedule and projected fan totals

## Adding Character Images

Character thumbnail images should be placed in `public/characters/`. See `public/characters/README.md` for detailed instructions on:

- Image specifications (300x400px, 3:4 aspect ratio recommended)
- Naming conventions
- Adding new characters

The app will display placeholder initials for any missing images.

## Technology Stack

- **React 18**: Modern React with hooks and StrictMode
- **Vite 5**: Lightning-fast build tool with HMR
- **ESLint 9**: Latest linting with flat config format
- **Modern JavaScript**: ES2020+ features

## Development Notes

- Uses ESLint 9 with the new flat configuration format
- All dependencies are current and actively maintained
- No deprecated packages or security vulnerabilities
- Optimized for modern browsers

## Notes

- The race data is drawn from the global server of Uma Musume where available
- Base fan amounts are multiplied by the total Fan Bonus from support cards
- The calculator stops suggesting races once 320,000 fans is achieved (Legend status)

## Future Enhancements

- Support for additional career scenarios (Aoharu Hai, etc.)
- More comprehensive race database
- Save/load schedule functionality
- Export schedule as image or PDF
- Mobile-responsive improvements

## License

MIT
