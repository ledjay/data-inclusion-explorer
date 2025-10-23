# Quickstart: Side Panel Navigation

**Feature**: Side Panel Navigation  
**Date**: 2025-10-23  
**Branch**: `001-side-panel-navigation`

## Overview

This guide helps you test and validate the side panel navigation feature after implementation.

---

## Prerequisites

- Node.js installed (version 20+)
- Repository cloned
- On branch `001-side-panel-navigation`

---

## Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   ```
   http://localhost:3000
   ```

---

## Testing the Feature

### 1. Basic Panel Functionality

**Test**: Open panel by clicking a card

1. Navigate to http://localhost:3000
2. Click on any service card in the list
3. **Expected**:
   - Panel slides in from the right with smooth animation (< 300ms)
   - Panel takes exactly 50% of screen width
   - Card list resizes to accommodate panel
   - Filter bar on the left remains unchanged (no movement, no resizing)
   - Service details display in the panel

**✅ Pass Criteria**:
- Panel animation is smooth and completes quickly
- Layout is 3-column: [Filter Bar (fixed)] [Card List (resized)] [Panel (50%)]
- Filter bar position and size unchanged

---

### 2. Panel Content

**Test**: Verify service details display correctly

1. With panel open, observe the content
2. **Expected**:
   - Service name displayed as heading
   - Description, type, frais, commune, contact info visible
   - Thématiques and publics shown as tags
   - "Show Raw Data" button visible
   - All data matches the card that was clicked

**✅ Pass Criteria**:
- All service fields display correctly
- Layout is clean and readable
- No missing or broken data

---

### 3. Raw Data Toggle

**Test**: Toggle raw JSON view

1. With panel open, click "Voir les données brutes" button
2. **Expected**:
   - JSON data appears below or alongside visual data
   - JSON is formatted and syntax-highlighted
   - Button text changes to "Masquer les données brutes"
3. Click button again
4. **Expected**:
   - JSON view hides
   - Button text changes back to "Voir les données brutes"

**✅ Pass Criteria**:
- Raw data toggle works smoothly
- JSON is readable and properly formatted
- Toggle state persists while panel is open

---

### 4. Navigate Between Cards

**Test**: Switch services without closing panel

1. With panel open showing Service A
2. Click on a different card (Service B) in the list
3. **Expected**:
   - Panel content updates to show Service B
   - Panel does NOT close or resize
   - Card list width remains stable
   - Filter bar remains unchanged
   - Smooth content transition (fade effect)

**✅ Pass Criteria**:
- Panel updates without closing
- No layout shifts or jumps
- Content transition is smooth

---

### 5. Close Panel

**Test**: Close panel via close button

1. With panel open, click the close button (X or "Fermer")
2. **Expected**:
   - Panel slides out to the right
   - Card list expands back to full width
   - Filter bar remains unchanged
   - Animation is smooth (< 300ms)

**✅ Pass Criteria**:
- Panel closes smoothly
- Layout returns to 2-column: [Filter Bar] [Card List (full width)]
- No visual glitches

---

### 6. Close Panel (Click Outside)

**Test**: Close panel by clicking outside

1. With panel open, click anywhere in the card list area
2. **Expected**:
   - Panel closes (same as close button)
   - Card list expands back to full width

**✅ Pass Criteria**:
- Clicking outside panel closes it
- Clicking inside panel does NOT close it

---

### 7. Keyboard Navigation

**Test**: Close panel with Escape key

1. With panel open, press `Escape` key
2. **Expected**:
   - Panel closes immediately
   - Focus returns to main content

**Test**: Tab navigation within panel

1. With panel open, press `Tab` key repeatedly
2. **Expected**:
   - Focus moves through interactive elements in panel
   - Focus does NOT escape to elements outside panel (focus trap)
   - Can navigate to "Show Raw Data" button, links, close button

**✅ Pass Criteria**:
- Escape key closes panel
- Tab key navigates within panel only
- All interactive elements are reachable

---

### 8. Filter Bar Stability

**Test**: Verify filter bar never moves

1. Open panel, close panel, switch services multiple times
2. Watch the filter bar on the left throughout all actions
3. **Expected**:
   - Filter bar position NEVER changes
   - Filter bar width NEVER changes
   - Filter bar content NEVER shifts

**✅ Pass Criteria**:
- Filter bar is completely static during all panel operations
- No visual movement or resizing whatsoever

---

### 9. Responsive Behavior (Desktop)

**Test**: Resize browser window with panel open

1. Open panel
2. Resize browser window (make it narrower and wider)
3. **Expected**:
   - Panel maintains 50% of window width
   - Card list adjusts proportionally
   - Filter bar remains fixed size
   - Layout remains usable at all sizes (down to ~768px)

**✅ Pass Criteria**:
- 50/50 split maintained during resize
- No layout breaks or overlaps
- Filter bar unaffected by resize

---

### 10. Mobile Responsiveness

**Test**: Test on mobile viewport (< 768px)

1. Open browser DevTools, switch to mobile view (e.g., iPhone)
2. Click on a service card
3. **Expected**:
   - Panel opens as full-screen overlay (100% width)
   - Card list is hidden behind panel
   - Panel has close button visible
   - Can scroll panel content

**✅ Pass Criteria**:
- Panel is full-screen on mobile
- Close button is accessible
- Content is readable and scrollable

---

### 11. URL State (Optional Feature)

**Test**: Verify URL updates with panel state

1. Open panel by clicking a card
2. Check browser URL bar
3. **Expected**:
   - URL includes `?service=<service-id>` parameter
   - Example: `http://localhost:3000/?service=abc123`
4. Click browser back button
5. **Expected**:
   - Panel closes
   - URL returns to previous state (without `service` parameter)

**✅ Pass Criteria**:
- URL reflects panel state
- Back button closes panel
- Can share URL with panel open

---

### 12. Error Handling

**Test**: Handle service fetch errors

1. Open DevTools Network tab
2. Throttle network to "Slow 3G" or block API requests
3. Click on a service card
4. **Expected**:
   - Panel opens
   - Loading state displays briefly
   - Error message displays if fetch fails
   - Error message is user-friendly (no technical jargon)
   - Can close panel even with error

**✅ Pass Criteria**:
- Loading states are clear
- Error messages are helpful
- Panel remains functional during errors

---

### 13. Long Content Scrolling

**Test**: Verify panel scrolls with long content

1. Find a service with lots of data (long description, many thématiques, etc.)
2. Open that service in panel
3. **Expected**:
   - Panel content is scrollable
   - Scroll bar appears if content exceeds panel height
   - Header/close button remains accessible while scrolling

**✅ Pass Criteria**:
- Panel scrolls smoothly
- All content is accessible via scroll
- No layout issues with long content

---

### 14. Performance

**Test**: Measure animation and load times

1. Open DevTools Performance tab
2. Click on a service card
3. Measure time from click to panel fully open and content loaded
4. **Expected**:
   - Panel animation completes in < 300ms
   - Service details load in < 2 seconds (on normal connection)
   - No janky animations or layout shifts

**✅ Pass Criteria**:
- Animations are smooth (60fps)
- Load times meet requirements
- No performance degradation

---

### 15. Filter Interaction

**Test**: Verify filters still work with panel open

1. Open panel
2. Change a filter (e.g., select different source)
3. **Expected**:
   - Card list updates with filtered results
   - Panel remains open with current service
   - Filter bar remains unchanged
   - No layout issues

**✅ Pass Criteria**:
- Filters work normally with panel open
- Panel state is independent of filter state
- No conflicts between panel and filters

---

## Common Issues & Solutions

### Issue: Panel doesn't slide smoothly

**Solution**: Check CSS transitions are applied correctly. Verify `transition-transform duration-300` classes are present.

### Issue: Filter bar moves when panel opens

**Solution**: Verify CSS Grid layout uses `auto` width for filter column, not fixed pixel width.

### Issue: Panel content doesn't load

**Solution**: Check browser console for API errors. Verify service ID is valid. Check network tab for failed requests.

### Issue: Escape key doesn't close panel

**Solution**: Verify keyboard event listener is attached. Check for JavaScript errors in console.

### Issue: Mobile view doesn't show full-screen panel

**Solution**: Check responsive breakpoints (`md:` prefix). Verify mobile styles use `fixed inset-0`.

---

## Manual Testing Checklist

Copy this checklist for testing:

```
[ ] Basic panel open/close functionality
[ ] Panel takes exactly 50% width on desktop
[ ] Filter bar remains completely fixed (no movement/resizing)
[ ] Card list resizes responsively
[ ] Service details display correctly
[ ] Raw data toggle works
[ ] Navigate between services without closing panel
[ ] Close button works
[ ] Click outside to close works
[ ] Escape key closes panel
[ ] Tab navigation within panel (focus trap)
[ ] Browser resize maintains 50/50 split
[ ] Mobile shows full-screen panel
[ ] URL updates with service parameter (if implemented)
[ ] Back button closes panel (if URL state implemented)
[ ] Error states display correctly
[ ] Long content scrolls properly
[ ] Animations are smooth (< 300ms)
[ ] Service loads quickly (< 2s)
[ ] Filters work with panel open
```

---

## Validation Complete

Once all tests pass, the feature is ready for:
1. Code review
2. Merge to main branch
3. Deployment to staging
4. Production deployment

---

## Rollback Plan

If issues are discovered in production:

1. **Immediate**: Revert to previous commit
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Redeploy**: Vercel will auto-deploy the revert

3. **Fix**: Address issues in feature branch, re-test, re-deploy

---

## Support

For questions or issues:
- Check implementation plan: `specs/001-side-panel-navigation/plan.md`
- Check research decisions: `specs/001-side-panel-navigation/research.md`
- Check data model: `specs/001-side-panel-navigation/data-model.md`

