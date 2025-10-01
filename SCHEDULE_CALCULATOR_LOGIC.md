# Schedule Calculator Logic - Enhanced

## Overview

The enhanced schedule calculator now intelligently optimizes race schedules based on:

1. **Character objectives** - Career-specific required races
2. **Aptitude filtering** - Only suggests races with B+ aptitudes
3. **Year preference** - Favors Year 2 and 3 races
4. **Fan optimization** - Fills gap to reach 320,000 fans target

## Calculation Steps

### Step 1: Calculate Fan Bonus

```javascript
totalBonus = sum of all support card fan bonuses (as decimals)
multiplier = 1 + totalBonus

Example:
- Card 1: 10%
- Card 2: 15%
- Card 3: 8%
- Total: 33% → multiplier = 1.33
```

### Step 2: Process Objective Races

```javascript
for each objective with a raceId:
  - Find the race in database
  - Calculate fans gained (race.fans * multiplier)
  - Mark as objective race
  - Add to objective race list

objectiveFans = sum of all objective race fans
```

**Assumptions:**

- All objective races are completed in **1st place**
- Fan rewards are for 1st place finishes
- Objectives are completed in order (chronologically)

### Step 3: Calculate Remaining Fans Needed

```javascript
TARGET = 320,000 fans
remainingFansNeeded = TARGET - objectiveFans
```

If `remainingFansNeeded > 0`, additional races are required.

### Step 4: Filter Candidate Races

**Exclusion Criteria:**

- ❌ Already in objective list
- ❌ Below B aptitude (both distance AND surface)

**Aptitude Check:**

```javascript
For race to be included:
  - Distance aptitude must be B or better (S, A, or B)
  - Surface aptitude must be B or better (S, A, or B)
  - If either is C or below, race is excluded
```

**Aptitude Ratings (best to worst):**
S > A > B > C > D > E > F > G

### Step 5: Score and Rank Races

**Base Score:**

```javascript
score = race.fans (base value)
```

**Multipliers:**

```javascript
if (race.year === 2) score *= 1.5  // 50% bonus for Year 2
if (race.year === 3) score *= 1.3  // 30% bonus for Year 3
if (race.distance === preferredDistance) score *= 1.1  // 10% bonus for preference match
```

**Why favor Year 2 and 3?**

- More training time in Year 1 for stats
- Year 3 has limited slots before finale
- Year 2 provides optimal balance

**Example Scoring:**

```
Race A: 20,000 fans, Year 1
  → score = 20,000

Race B: 20,000 fans, Year 2
  → score = 20,000 * 1.5 = 30,000

Race C: 20,000 fans, Year 3, matches distance pref
  → score = 20,000 * 1.3 * 1.1 = 28,600
```

### Step 6: Fill Schedule

```javascript
schedule = [...objectiveRaces]
cumulativeFans = objectiveFans

for each candidate (highest score first):
  if (cumulativeFans >= 320,000) break
  
  add race to schedule
  cumulativeFans += (race.fans * multiplier)
```

### Step 7: Sort Chronologically

Final schedule is sorted by:

1. Year (1 → 2 → 3)
2. Month (January → December)
3. Week (Early → Late)

This provides a natural timeline for race planning.

## Result Data Structure

```javascript
{
  schedule: [
    {
      ...raceData,
      fansWithBonus: 26600,      // Fans with bonus applied
      isObjective: true,          // Career objective marker
      objectiveText: "1. Participate..." // Objective description
    },
    // ... more races
  ],
  totalFans: 345200,              // Total fans from all races
  objectiveFans: 187300,          // Fans from objectives only
  additionalFansNeeded: 132700,   // Gap to fill after objectives
  preFinalFans: 345200            // Same as total (pre-finale)
}
```

## Display Features

### Summary Section

- **Total fans gained:** Overall total with bonus
- **Fans from objectives:** Just from career objectives
- **Additional fans needed:** Gap after objectives
- **Success/Warning:** Whether 320k target is reached

### Race Table

- **Objective races:** Marked with ★ and gold highlight
- **Distance badges:** Color-coded by distance type
- **Surface badges:** Color-coded Turf/Dirt
- **Fan calculations:** Base fans and with-bonus fans

### Visual Indicators

```
★ = Career objective race (gold star)
🟧 Gold highlight = Objective race row
🟦 Blue badges = Medium distance
🟣 Purple badges = Long distance
🟠 Orange badges = Mile distance
🔴 Red badges = Short distance
🟢 Green badges = Turf surface
🟤 Brown badges = Dirt surface
```

## Example Calculation

### Input

- **Character:** Special Week
- **Support Deck:** 6 cards with 10% each = 60% total
- **Multiplier:** 1.6

### Objectives (7 races)

1. Junior Make Debut: 5,000 fans → 8,000 with bonus
2. Kisaragi Sho: 20,000 fans → 32,000 with bonus
3. Tokyo Yushun: 30,000 fans → 48,000 with bonus
4. Kikuka Sho: 20,000 fans → 32,000 with bonus
5. Tenno Sho Spring: 20,000 fans → 32,000 with bonus
6. Japan Cup: 30,000 fans → 48,000 with bonus
7. Arima Kinen: 20,000 fans → 32,000 with bonus

**Objective Total:** 232,000 fans

### Additional Races Needed

- **Gap:** 320,000 - 232,000 = 88,000 fans
- **Races needed:** ~3-4 additional races (depending on fan values)

### Candidate Filtering

Special Week aptitudes:

- **Distance:** F Short, C Mile, A Medium, A Long
- **Surface:** A Turf, G Dirt

**Eligible races:**

- ✅ Medium distance + Turf surface
- ✅ Long distance + Turf surface
- ❌ Short distance (F rating)
- ❌ Mile distance (C rating)
- ❌ Any Dirt surface (G rating)

### Final Schedule

7 objective races + ~3-4 optimal additional races = ~10-11 total races

## Optimization Benefits

### Before Enhancement

- Listed ALL races matching distance
- No consideration of aptitudes
- No objective race integration
- Manual calculation required

### After Enhancement

- **Smart filtering:** Only B+ aptitude races
- **Objective integration:** Auto-includes career goals
- **Optimized selection:** Favors Year 2/3 for efficiency
- **Clear breakdown:** Shows exactly what's needed

## Use Cases

### Case 1: Strong Objectives

Character with high-fan objectives (e.g., many G1 races):

- Objectives alone might reach 250k+ fans
- Only need 2-3 additional races
- Very efficient schedule

### Case 2: Weak Objectives

Character with low-fan objectives or few objectives:

- More additional races needed
- Calculator fills gap intelligently
- Still optimized for aptitudes

### Case 3: Specialized Uma

Character with narrow aptitudes (e.g., only Mile + Dirt):

- Fewer eligible races
- May need more races to reach target
- Calculator maximizes available options

### Case 4: Generalist Uma

Character with broad aptitudes (multiple B+ ratings):

- Many eligible races
- Can be very selective
- Picks highest-value Year 2/3 races

## Future Enhancements

### Potential Additions

1. **Turn optimization:** Consider turn spacing between races
2. **G1 preference:** Favor G1 races for titles/skills
3. **Stat balancing:** Suggest races that cover weak stats
4. **Skill acquisition:** Factor in race-specific skill triggers
5. **Multiple scenarios:** Show min/max race schedules
6. **Aptitude training:** Account for potential aptitude growth

### User Customization

- Allow users to adjust Year 2/3 preference weights
- Toggle strict aptitude filtering (B+ vs C+)
- Manual race addition/removal
- Save/load custom schedules

## Technical Notes

### Performance

- O(n) for objective processing
- O(n log n) for race scoring and sorting
- Efficient even with 378 races in database
- Instant calculation (<100ms typical)

### Data Dependencies

- Requires `characters.json` with objectives and aptitudes
- Requires `races.json` with complete race data
- Requires `raceId` foreign keys linking objectives to races

### Error Handling

- Gracefully handles missing aptitude data
- Works without objectives (falls back to scoring only)
- Handles characters without full profile data
- Never crashes on missing race IDs

## Summary

The enhanced calculator provides:
✅ **Intelligent race selection** based on aptitudes  
✅ **Objective integration** for career planning  
✅ **Year optimization** for efficient training  
✅ **Clear visualization** of career vs additional races  
✅ **Accurate fan calculations** with support bonuses  
✅ **Achievable schedules** tailored to each character  

This transforms the tool from a simple race lister to a true optimization engine!
