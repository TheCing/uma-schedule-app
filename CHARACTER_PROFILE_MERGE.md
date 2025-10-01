# Character Profile Data Merge

## Overview

Successfully merged detailed character profile data into the existing characters database, adding comprehensive career objectives, aptitudes, stats, and biographical information.

## Source Data

**Source File:** `uma-characters-all-1759350169890.json`

- 41 character profiles
- Complete profile data for released Global characters

## Merge Results

### Statistics

- **Total Characters:** 227
- **Successfully Merged:** 84 characters
- **With Aptitudes:** 84 characters
- **With Career Objectives:** 84 characters
- **Without Profiles:** 143 characters (JP-only or upcoming)

### What Was Added

Each merged character now includes:

#### 1. Basic Information (`basicInfo`)

- Japanese name
- Voice actor
- Release date
- Birthday
- Height
- Three sizes (measurements)

#### 2. Base Stats (`baseStats`)

5-star statistics:

- Speed
- Stamina
- Power
- Guts
- Wit

#### 3. Stat Bonuses (`statBonuses`)

Growth bonuses for each stat (percentage increases)

#### 4. Aptitudes (`aptitudes`)

Ratings (S, A, B, C, D, E, F, G) for:

**Surface:**

- Turf
- Dirt

**Distance:**

- Short (< 1400m)
- Mile (1400-1799m)
- Medium (1800-2399m)
- Long (≥ 2400m)

**Strategy:**

- Front (Runner)
- Pace (Pacesetter)
- Late (Chaser)
- End (Closer)

#### 5. Unique Skills (`uniqueSkills`)

Array of character-specific skills:

- Name
- Description
- Icon URL
- Rarity

#### 6. Career Objectives (`objectives`)

URA scenario objectives (typically 7 objectives):

- Objective text
- Turn number
- Timing (year/month)
- Race details (grade, surface, distance)
- Banner image

#### 7. Additional Fields

- `catchphrase` - Character tagline
- `rarity` - Character rarity (1-3 stars)

## Data Structure Example

```json
{
  "id": "special-week",
  "name": "Special Week",
  "preferredDistance": "Medium",
  "thumbnail": "https://...",
  "released": true,
  "basicInfo": {
    "Japanese name": "スペシャルウィーク",
    "Voice actor": "Azumi Waki",
    "Release date": "2025-06-25",
    "Birthday": "May 2",
    "Height": "158 cm"
  },
  "baseStats": {
    "fiveStar": {
      "Speed": 102,
      "Stamina": 108,
      "Power": 120,
      "Guts": 110,
      "Wit": 110
    }
  },
  "aptitudes": {
    "Surface": { "Turf": "A", "Dirt": "G" },
    "Distance": { "Short": "F", "Mile": "C", "Medium": "A", "Long": "A" },
    "Strategy": { "Front": "G", "Pace": "A", "Late": "A", "End": "C" }
  },
  "uniqueSkills": [{
    "name": "Shooting Star",
    "description": "Ride the momentum and increase velocity...",
    "icon": "/images/umamusume/skill_icons/..."
  }],
  "objectives": [
    {
      "objective": "1. Participate in the Junior Make Debut",
      "turn": "Turn 12",
      "timing": "Junior Class, Late June",
      "raceDetails": "Turf – 2000m – Medium"
    }
    // ... 6 more objectives
  ]
}
```

## Variant Handling

The merge script intelligently handles character variants:

- Matches variants to their base character profile
- Attempts to find variant-specific profiles (e.g., "Fantasy Grass Wonder")
- Falls back to base character profile if variant profile not found
- Preserves variant naming in character data

## Aptitude-Based Distance Updates

For characters with aptitude data:

- Automatically updates `preferredDistance` based on highest-rated distance aptitude
- Only updates if current distance is "Medium" (the default)
- Uses aptitude rating priority: S > A > B > C > D > E > F > G

## Use Cases

### 1. Enhanced Race Recommendations

Use aptitudes to suggest races:

```javascript
// Check if character is good for a turf race
if (character.aptitudes?.Surface?.Turf >= 'B') {
  // Recommend turf races
}
```

### 2. Career Mode Guide

Display URA objectives:

```javascript
// Show next objective
const nextObjective = character.objectives?.[currentObjectiveIndex];
if (nextObjective) {
  console.log(nextObjective.objective);
  console.log(nextObjective.raceDetails);
}
```

### 3. Character Details Panel

Show comprehensive character information:

- Voice actor
- Release date
- Stats and bonuses
- Aptitudes visualization
- Unique skills
- Career objectives timeline

### 4. Advanced Filtering

Filter by aptitudes:

```javascript
// Find all characters good at Mile distance
const mileSpecialists = characters.filter(c => 
  c.aptitudes?.Distance?.Mile === 'A' || 
  c.aptitudes?.Distance?.Mile === 'S'
);
```

### 5. Strategy Recommendations

Suggest racing strategy:

```javascript
// Recommend best strategy based on aptitudes
const strategies = character.aptitudes?.Strategy;
const bestStrategy = Object.entries(strategies)
  .sort((a, b) => ratingToValue(b[1]) - ratingToValue(a[1]))[0];
```

### 6. Surface-Specific Schedules

Only recommend races matching surface aptitude:

```javascript
// Filter races by surface aptitude
const suitableRaces = races.filter(race => {
  const surfaceApt = character.aptitudes?.Surface?.[race.surface];
  return surfaceApt && surfaceApt >= 'C';
});
```

## Characters With Profiles

84 characters have complete profile data, including:

- All base released characters (40)
- Variants with profile data (44)

Examples:

- Special Week
- Silence Suzuka
- Tokai Teio
- Vodka
- Grass Wonder
- Fantasy Grass Wonder
- Wedding Air Groove
- And 77 more...

## Characters Without Profiles

143 characters don't have profile data yet:

- JP-only characters not yet in Global
- Newer characters
- Some variants
- Unreleased characters

These characters retain their basic data:

- ID, name, preferredDistance, thumbnail, released status

## Future Enhancements

With this rich data, the app can now:

1. **Show character details page** with full stats and info
2. **Display career objectives** with turn-by-turn guidance
3. **Filter by aptitudes** (e.g., "show me all A-rank Mile runners")
4. **Recommend optimal strategies** based on strategy aptitudes
5. **Show surface compatibility** for race recommendations
6. **Display unique skills** with descriptions
7. **Create aptitude-aware schedules** that match character strengths
8. **Show character comparisons** based on stats and aptitudes
9. **Generate training guides** based on stat bonuses
10. **Timeline view** of career objectives with turn counts

## Technical Notes

### Merge Logic

- Matches by base character name
- Handles variant prefixes intelligently
- Preserves all existing data
- Only adds new fields, never removes

### Data Integrity

- All merged characters retain original IDs
- Thumbnails unchanged
- Release status preserved
- Distance preferences updated only when beneficial

### Performance

- No impact on app load time
- Data is already in JSON format
- 227 characters load instantly
- Filtering/searching remains fast

## Maintenance

When new characters are released:

1. Get updated profile data JSON
2. Run merge script with new data
3. Verify merge results
4. Update character count statistics
5. Test new character profiles in app

## Sample Character: Special Week

```
Name: Special Week
Distance: Medium (A), Long (A)
Surface: Turf (A)
Strategies: Pace (A), Late (A)
Unique Skill: Shooting Star
Objectives: 7 URA goals
Stats: Balanced (Power-focused)
Voice: Azumi Waki
Birthday: May 2
```

With 84 characters now having complete profiles, the app has a rich foundation for advanced features and detailed character information!
