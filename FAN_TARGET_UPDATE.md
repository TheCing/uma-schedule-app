# Fan Target Update

## Change Summary

Updated the fan calculation logic to reflect the correct target: **240,000 fans before the URA Finale**, not 320,000.

## Why This Matters

### URA Finale Structure

The URA finale consists of three mandatory races that happen AFTER the regular training schedule:

1. **URA Semi-Final** (~20k-25k fans)
2. **URA Final** (~25k-30k fans)  
3. **Twinkle Series Final** (~30k-35k fans)

**Combined:** These three races provide approximately **~80,000 fans** when won.

### Legend Status Requirement

- **Total fans needed for Legend:** 320,000
- **Fans from URA finale races:** ~80,000
- **Fans needed BEFORE finale:** **240,000**

## Technical Changes

### 1. Schedule Calculator (`src/utils/scheduleCalculator.js`)

**Before:**

```javascript
const TARGET_FANS = 320000;
```

**After:**

```javascript
const TARGET_FANS = 240000; // Fans needed BEFORE URA finale (finale races provide ~80k more)
```

### 2. Results Display (`src/components/ResultsDisplay.jsx`)

**Before:**

```javascript
{results.totalFans >= 320000 ? (
  <p className="success-message">
    ✓ Target reached! You'll achieve Legend status (320,000 fans)
  </p>
) : (
  <p className="warning-message">
    ⚠ Short of target by {(320000 - results.totalFans).toLocaleString()} fans
  </p>
)}
```

**After:**

```javascript
{results.totalFans >= 240000 ? (
  <p className="success-message">
    ✓ Target reached! You'll hit 240k+ before finals. With the URA finale races (~80k fans), you'll achieve Legend status!
  </p>
) : (
  <p className="warning-message">
    ⚠ Short of target by {(240000 - results.totalFans).toLocaleString()} fans (need 240k before finals)
  </p>
)}
```

## Impact on Schedule Generation

### Race Selection

The calculator now:

1. ✅ Starts with objective races
2. ✅ Fills deficit to reach **240,000** (not 320,000)
3. ✅ Filters by character aptitudes (B+ required)
4. ✅ Favors Year 2 and Year 3 races
5. ✅ Assumes 1st place wins in all races

### Fan Calculation Flow

```
Base Fans (from races)
  × (1 + Support Card Fan Bonus)
  = Total Fans Before Finale

If Total Fans >= 240,000:
  + URA Finale Races (~80,000)
  = ~320,000+ Total Fans
  = Legend Status! 🏆
```

## User Messaging

The app now clearly communicates:

- The actual target is 240k before finals
- The finale races will provide the remaining fans
- Success is measured against 240k, not 320k
- Warning messages show deficit against 240k

## Example Scenario

**Character:** Rice Shower  
**Support Bonus:** 30% (0.30)  
**Objective Races:** 150k base fans  

**Calculation:**

```
Objective fans with bonus: 150,000 × 1.30 = 195,000
Deficit: 240,000 - 195,000 = 45,000 needed

Additional races selected to cover 45,000+ base fans
With bonus applied, reaches ~240,000+

Final races: +80,000
Total: ~320,000+ (Legend!)
```

## Benefits

✅ **More realistic schedules** - No longer over-schedules races  
✅ **Better pacing** - Leaves room for training/rest  
✅ **Accurate expectations** - Matches actual game mechanics  
✅ **Clearer messaging** - Users understand the full path to Legend  

## Testing

To verify the change works:

1. Select a character with objectives
2. Add support card fan bonuses
3. Click "Calculate Schedule"
4. Check that success message appears at ~240k fans
5. Verify it explains that finale races will complete the journey

---

**Date Updated:** 2025-10-01  
**Files Modified:** 2  
**Target Changed:** 320k → 240k (before finals)
