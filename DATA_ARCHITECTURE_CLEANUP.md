# Data Architecture Cleanup

## Problem Identified

The codebase had **two separate sources** for race data:
1. `src/data/races.json` - JSON source of truth
2. `src/data/raceData.js` - Hardcoded JavaScript export

This caused:
- ❌ **Data sync issues** - Updating JSON didn't affect the app
- ❌ **Maintenance burden** - Had to keep two files in sync
- ❌ **Confusion** - Unclear which file was the actual source of truth
- ❌ **Larger bundle** - Duplicate data in the build

## Solution

### Single Source of Truth

Now we use **only `src/data/races.json`** directly:

```javascript
// Before (BAD)
import { RACE_DATA } from "./data/raceData";

// After (GOOD)
import racesData from "./data/races.json";
```

### Benefits

✅ **One source of truth** - All race data in `races.json`  
✅ **Automatic updates** - Edit JSON, app updates immediately  
✅ **Smaller bundle** - No duplicate data  
✅ **Clearer intent** - JSON is clearly the data file  
✅ **Easier maintenance** - Update one file, not two  

## Files Changed

### Modified
- **`src/App.jsx`** - Changed import from `raceData.js` to `races.json`

### Deleted
- **`src/data/raceData.js`** - Removed redundant hardcoded file
- **`fix_race_fans.cjs`** - Temporary script (no longer needed)
- **`regenerate_raceData.cjs`** - Temporary script (no longer needed)

## Current Data Structure

### Race Data
**Location:** `src/data/races.json`  
**Format:** Array of 378 race objects  
**Usage:** Imported directly in App.jsx

```javascript
import racesData from "./data/races.json";
```

### Character Data
**Location:** `src/data/characters.json`  
**Format:** Array of 227 character objects with profiles  
**Usage:** Imported directly in App.jsx and CharacterCard.jsx

```javascript
import charactersData from "./data/characters.json";
```

## Best Practices Established

### DO ✅
- Store data in JSON files
- Import JSON directly in components
- Keep one source of truth per data type
- Use meaningful import names (e.g., `racesData` not `RACE_DATA`)

### DON'T ❌
- Create hardcoded JS files from JSON
- Duplicate data across multiple files
- Use all-caps names for regular data imports
- Generate static files when JSON can be used directly

## Why This Works

### Modern JavaScript/React

Modern build tools (Vite, webpack) handle JSON imports efficiently:
- **Tree shaking** - Only used data is included
- **Minification** - JSON is compressed
- **Code splitting** - Large data can be lazy loaded if needed
- **Hot reload** - Changes to JSON trigger instant updates

### Performance

There's **no performance penalty** for importing JSON vs. JS:
- Both are parsed at build time
- Both result in the same runtime representation
- JSON is actually slightly smaller in source form

## Migration Notes

If you need to update race data in the future:

1. Edit `src/data/races.json` directly
2. App will hot-reload automatically
3. No need to regenerate any other files
4. Changes take effect immediately

## Example: Adding a New Race

```json
{
  "id": "new-race-y2",
  "name": "New Race",
  "year": 2,
  "month": "March",
  "week": "Early",
  "fans": 5000,
  "distance": "Mile",
  "meters": 1600,
  "surface": "Turf",
  "notes": []
}
```

Just add it to `races.json` - that's it!

## Summary

**Before:** Data in JSON → Generate JS file → Import JS → Use in app  
**After:** Data in JSON → Import JSON → Use in app

Simple, clean, maintainable! 🎉

