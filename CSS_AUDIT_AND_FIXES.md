# CSS Audit and Fixes

## Problem Identified

The root cause of CSS override issues is **overly specific global styles** in `src/index.css` that conflict with component-specific styles.

### Specific Issues

#### 1. **Global Input/Select Styles (index.css:34-46)**

```css
input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 0.4rem;
  margin-bottom: 0.5rem;
  /* ... */
}
```

**Impact:** Forces `width: 100%` and specific padding on ALL inputs, overriding component styles.

**Why This Causes Problems:**

- Component styles need different padding for layout purposes
- Some inputs shouldn't be 100% width
- Forces use of `!important` in components to override

## Solution Strategy

### Approach 1: Scoped Global Styles (RECOMMENDED)

Make global styles apply only to inputs/selects that are **direct children** of specific containers, not nested in components.

### Approach 2: Component-First Design

Remove aggressive global styles and ensure each component fully controls its own styling.

## Recommended Fixes

### Fix 1: Update `index.css` - Make Global Styles Defensive

**Current (Problematic):**

```css
input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 0.4rem;
  /* ... */
}
```

**Fixed (Defensive):**

```css
/* Only apply to inputs NOT in specific component containers */
input[type="text"]:not([class*="input"]):not([id*="input"]),
input[type="number"]:not([class*="input"]):not([id*="input"]),
select:not([class*="select"]):not([id*="select"]) {
  width: 100%;
  padding: 0.4rem;
  /* ... */
}
```

OR (simpler, recommended):

```css
/* Set defaults, allow components to override without !important */
input[type="text"],
input[type="number"],
select {
  padding: 0.4rem;
  border: none;
  border-radius: 4px;
  background: var(--bg);
  color: var(--text);
  box-sizing: border-box;
  font-size: 0.9rem;
  /* Remove width: 100% - let components decide */
  /* Remove margin-bottom - let components decide */
}
```

### Fix 2: Standardize Component CSS Patterns

#### Pattern for All Components

1. **Container** - Handles layout
2. **Element** - Specific styling with higher specificity
3. **State** - Hover, focus, etc.

#### Example (Good Pattern)

```css
.component-name {
  /* Container styles */
}

.component-name .element-class {
  /* Element styles - specific enough to override globals */
}

.component-name .element-class:hover {
  /* State styles */
}
```

### Fix 3: Remove Unnecessary `!important` Flags

After fixing global styles, remove `!important` from:

- `SupportDeckInput.css`
- `CharacterCard.css` (info-button)
- Any other components

## CSS Specificity Hierarchy

**Current Reality:**

1. Global styles in `index.css` (low specificity)
2. Component styles (should win but don't always)
3. `!important` flags (nuclear option - avoid)

**Ideal State:**

1. Global defaults in `index.css` (very low specificity)
2. Component styles (always win)
3. No `!important` flags needed

## Component-by-Component Review

### ✅ App.css

- **Status:** Clean
- **Issues:** None
- **Action:** No changes needed

### ⚠️ CharacterCard.css

- **Status:** Has `!important` on `.info-button`
- **Issues:** Circle shape required forcing with `!important`
- **Action:** Keep `!important` for critical layout properties (width, height, aspect-ratio) - this is acceptable for critical shape enforcement

### ⚠️ SupportDeckInput.css

- **Status:** Has `!important` on multiple properties
- **Issues:** Fighting global `input` styles
- **Action:**
  1. Fix global styles first
  2. Remove `!important` after testing
  3. Use more specific selectors if needed

### ✅ TraineeSelection.css

- **Status:** Clean
- **Issues:** None
- **Action:** No changes needed

### ✅ ResultsDisplay.css

- **Status:** Clean
- **Issues:** None
- **Action:** No changes needed

### ✅ CareerSelection.css

- **Status:** Clean
- **Issues:** None
- **Action:** No changes needed

## Implementation Plan

### Phase 1: Fix Global Styles (index.css)

1. Remove `width: 100%` from global input/select styles
2. Remove `margin-bottom` from global input/select styles
3. Keep only truly global properties (colors, font-size, box-sizing)

### Phase 2: Test All Components

1. Verify CharacterCard still displays correctly
2. Verify SupportDeckInput percent signs align
3. Verify TraineeSelection inputs work
4. Verify all other input fields render correctly

### Phase 3: Clean Up Component Styles

1. Remove unnecessary `!important` from SupportDeckInput.css
2. Keep necessary `!important` for critical layout properties
3. Add comments explaining any remaining `!important`

### Phase 4: Establish Style Guidelines

1. Document global style scope
2. Document component style patterns
3. Create examples of correct patterns

## Best Practices Going Forward

### DO

- ✅ Use specific class names in components (`.component-name-element`)
- ✅ Keep global styles minimal and defensive
- ✅ Use `!important` only for critical layout enforcement
- ✅ Comment why `!important` is used when necessary
- ✅ Test styling in all components after changing global styles

### DON'T

- ❌ Set layout properties (width, margin, padding) globally
- ❌ Use `!important` without understanding why
- ❌ Create deeply nested selectors (>.> keeps specificity manageable)
- ❌ Assume component styles will always override globals

## Testing Checklist

After implementing fixes, verify:

- [ ] Character selection grid displays correctly
- [ ] Character cards maintain aspect ratio and shape
- [ ] Info button is a perfect circle
- [ ] Card hover/select glows follow rounded corners
- [ ] Support deck inputs display in 6 columns
- [ ] Percent signs align with input values
- [ ] Percent signs are vertically centered
- [ ] All dropdowns (career, aptitudes) work correctly
- [ ] Results table displays correctly
- [ ] App fits in one screen without scrolling
- [ ] Responsive layouts work at different screen sizes

## Summary

**Root Cause:** Overly aggressive global styles in `index.css`

**Solution:** Make global styles defensive, allow components to control their own layout

**Outcome:** No more `!important` wars, predictable styling behavior

**Timeline:**

1. Fix `index.css` (5 minutes)
2. Test all components (10 minutes)
3. Remove unnecessary `!important` (5 minutes)
4. Document and commit (5 minutes)

**Total:** ~25 minutes for a complete fix
