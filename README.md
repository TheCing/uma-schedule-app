# Uma Musume Race Schedule Calculator

A React-based race scheduling tool for Uma Musume Pretty Derby's URA scenario. This application helps players plan their optimal race schedule to maximize fan gains and achieve Legend status (240,000+ fans before URA Finals).

## Features

### Core Functionality
- **Visual Character Selection**: Browse and select from a comprehensive roster of Uma Musume characters with thumbnail images
- **Smart Filtering**: Filter characters by preferred distance (Short/Mile/Medium/Long)
- **Character Objectives**: Automatically includes mandatory character objective races in the schedule
- **Aptitude-Based Optimization**: Only suggests races where the character has B+ aptitude for both distance and surface
- **Multi-step Wizard Flow**: Intuitive 4-step process - Trainee → Support Deck → Career → Results
- **Support Deck Integration**: Input up to 6 support cards with their fan bonus percentages
- **Dynamic Fan Calculation**: Real-time calculation of fan gains with support card bonuses applied
- **Warning System**: Alerts when projected fans before URA Finals are below the 240,000 threshold
- **Race Prioritization**: Intelligently scores races based on fan gain, distance preference, and grade

### UI/UX
- **Responsive Design**: Dark theme inspired by Uma Musume's in-game aesthetic
- **Smooth Animations**: Polished transitions and hover effects throughout
- **Step Progress Indicator**: Clear visual feedback of your progress through the wizard
- **Character Cards**: Modern card-based layout with hover states and visual indicators
- **Accessibility**: Semantic HTML and ARIA labels for screen reader support

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/TheCing/uma-schedule-app.git
cd uma-schedule-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build optimized production bundle to `dist/`
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
uma-schedule-app/
├── src/
│   ├── components/              # React components
│   │   ├── TraineeSelection.jsx     # Character selection with filtering
│   │   ├── CharacterCard.jsx        # Individual character card component
│   │   ├── SupportDeckInput.jsx     # Support card input form
│   │   ├── CareerSelection.jsx      # Career path selection
│   │   └── ResultsDisplay.jsx       # Schedule results display
│   ├── data/                    # Static data files
│   │   ├── characters.json          # Character database with stats & objectives
│   │   └── races.json               # Race database with fan amounts
│   ├── utils/                   # Utility functions
│   │   ├── scheduleCalculator.js    # Schedule optimization algorithm
│   │   └── characterUtils.js        # Character helper functions
│   ├── App.jsx                  # Main app component with wizard logic
│   ├── App.css                  # App-level styles
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles
├── public/
│   └── characters/              # Character thumbnail images
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint 9 flat config
└── package.json                 # Dependencies and scripts
```

## How to Use

### Step-by-Step Guide

1. **Select Trainee**
   - Browse the character grid or use the distance filter to narrow down options
   - Click on your chosen Uma Musume to select them
   - The app automatically sets their preferred distance
   - Click "Continue to Support Deck" to proceed

2. **Support Deck Input**
   - Enter details for up to 6 support cards
   - For each card, optionally input:
     - Support card name (for reference)
     - Level (for reference)
     - Fan Bonus percentage (affects calculations)
   - Fan bonuses from all cards are summed and applied to all race rewards
   - Click "Continue to Career" to proceed

3. **Select Career Path**
   - Currently supports URA Finals career path
   - Click "Calculate Schedule" to generate your optimized race schedule

4. **View Results**
   - See your complete race schedule with:
     - Character objective races (mandatory)
     - Additional recommended races to reach 240,000+ fans
     - Fan gains per race (with bonuses applied)
     - Running total of accumulated fans
   - Races are color-coded:
     - Objective races are highlighted
     - Warning indicators if total fans fall short
   - Click "Start Over" to create a new schedule

## Schedule Calculation Logic

The app uses an intelligent algorithm to optimize your race schedule:

1. **Objective Races**: Automatically includes all mandatory character objective races
2. **Aptitude Filtering**: Only considers races where the character has B+ aptitude for both distance and surface
3. **Scoring System**: Ranks races based on:
   - Fan reward amount
   - Match with character's preferred distance
   - Race grade (G1 > G2 > G3)
4. **Fan Target**: Aims for 240,000 fans before URA Finals (finals provide ~80,000 additional fans)
5. **Optimization**: Selects the most efficient races to minimize training turns while maximizing fan gains

## Character Data

The app includes comprehensive data for each character:
- **Basic Info**: Japanese name, voice actor, release date, birthday, physical stats
- **Game Stats**: Base stats at different star levels (Speed, Stamina, Power, Guts, Wit)
- **Stat Bonuses**: Percentage bonuses for each stat
- **Aptitudes**: Distance, surface, and running strategy aptitudes (S to G ratings)
- **Objectives**: Character-specific race objectives with target placements
- **Preferred Distance**: Auto-detected optimal race distance

## Race Database

Includes detailed race information:
- Race name, grade, distance, and surface
- Base fan rewards (before support bonuses)
- Month/turn when each race is available
- Links to character objectives

## Technology Stack

- **React 19**: Latest React with modern hooks and concurrent features
- **Vite 7**: Next-generation frontend tooling with lightning-fast HMR
- **Lucide React**: Beautiful, consistent icon library
- **ESLint 9**: Modern linting with flat configuration format
- **Modern JavaScript**: ES2020+ features and modules

## Development Notes

- Uses ESLint 9 with the new flat configuration format
- All dependencies are current and actively maintained
- Optimized for modern browsers (ES2020+)
- No build warnings or linter errors
- Follows React 19 best practices

## Data Sources

- Race data sourced from GameTora's Uma Musume database
- Character information from the global server where available
- Continuously updated as new characters are released

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Future Enhancements

- [ ] Support for additional career scenarios (Aoharu Cup, Team Races, Grand Masters)
- [ ] Advanced filtering (by rarity, release status, stats)
- [ ] Save/load schedules with browser localStorage
- [ ] Export schedule as image or PDF
- [ ] Race detail view with venue information
- [ ] Support card database integration
- [ ] Mobile app version
- [ ] Multi-language support (EN/JP)

## License

MIT
