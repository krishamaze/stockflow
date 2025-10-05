# Cascading Autocomplete Combobox - Testing Guide

This guide outlines the testing strategy and procedures for completing Phase 3 (Production Readiness) of the cascading combobox component.

## Testing Checklist

### ✅ Phase 1 & 2 (Complete)
- [x] Component implementation
- [x] Mock API routes
- [x] Demo page
- [x] Basic unit tests

### ⏳ Phase 3 (Remaining)
- [ ] Bundle size analysis
- [ ] Accessibility testing
- [ ] Comprehensive test coverage
- [ ] Performance profiling
- [ ] Cross-browser validation
- [ ] Load testing

## 1. Bundle Size Analysis

### Goal
Verify bundle size is <20KB gzipped.

### Steps

1. **Run Bundle Analyzer**
```bash
npm run analyze
```

2. **Check Output**
- Look for `components/ui/cascading-combobox.tsx` in the bundle map
- Verify total size including dependencies (Radix UI, Fuse.js)
- Target: <20KB gzipped

3. **Optimization Strategies (if needed)**
- Code splitting for Fuse.js (lazy load)
- Tree-shaking unused Radix UI components
- Minimize inline styles
- Use dynamic imports for debug panel

### Success Criteria
- [ ] Bundle size <20KB gzipped
- [ ] No unnecessary dependencies included
- [ ] Code splitting implemented if needed

## 2. Accessibility Testing

### Goal
Achieve WCAG 2.1 AA compliance and Lighthouse score of 100/100.

### Tools Required
- NVDA screen reader (Windows)
- JAWS screen reader (Windows)
- VoiceOver (macOS)
- axe DevTools browser extension
- Lighthouse (Chrome DevTools)

### Manual Testing with Screen Readers

#### NVDA (Windows)
1. Install NVDA from https://www.nvaccess.org/
2. Navigate to `/demo/combobox`
3. Test the following:
   - [ ] Label is announced when focusing field
   - [ ] Required state is announced
   - [ ] Disabled state is announced
   - [ ] Options are announced when navigating with arrow keys
   - [ ] Selected option is announced
   - [ ] Error messages are announced
   - [ ] Loading state is announced

#### JAWS (Windows)
1. Install JAWS trial from https://www.freedomscientific.com/
2. Repeat NVDA tests above
3. Verify consistent behavior

#### VoiceOver (macOS)
1. Enable VoiceOver (Cmd+F5)
2. Repeat tests above
3. Verify consistent behavior

### Automated Testing with axe DevTools

1. **Install Extension**
   - Chrome: https://chrome.google.com/webstore (search "axe DevTools")
   - Firefox: https://addons.mozilla.org/firefox/ (search "axe DevTools")

2. **Run Scan**
   - Navigate to `/demo/combobox`
   - Open DevTools → axe DevTools tab
   - Click "Scan ALL of my page"

3. **Fix Issues**
   - Address all Critical and Serious issues
   - Document any Best Practices issues
   - Re-scan until zero violations

### Lighthouse Audit

1. **Run Audit**
   - Open Chrome DevTools
   - Navigate to Lighthouse tab
   - Select "Accessibility" category
   - Click "Generate report"

2. **Review Results**
   - Target: 100/100 score
   - Fix any flagged issues
   - Re-run until target achieved

### Success Criteria
- [ ] NVDA: All announcements correct
- [ ] JAWS: All announcements correct
- [ ] VoiceOver: All announcements correct
- [ ] axe DevTools: Zero violations
- [ ] Lighthouse: 100/100 accessibility score

## 3. Comprehensive Test Coverage

### Goal
Achieve >85% code coverage across all component code.

### Test Categories

#### Unit Tests (Utilities)
```bash
npm test lib/utils/__tests__/
```

**Coverage:**
- [x] `fuzzy-search.test.ts` - Basic tests in place
- [x] `cache.test.ts` - Basic tests in place
- [ ] `cn.test.ts` - Need to add

**Additional Tests Needed:**
- Edge cases for fuzzy search
- Cache eviction scenarios
- ETag validation
- Error handling

#### Integration Tests (Hooks)
```bash
npm test lib/hooks/__tests__/
```

**Coverage:**
- [ ] `use-debounced-search.test.ts` - Need to create

**Tests Needed:**
- Debouncing behavior
- Request cancellation
- Cache integration
- Error handling
- Prefetch vs lazy loading

#### Component Tests
```bash
npm test components/ui/__tests__/
```

**Coverage:**
- [ ] `cascading-combobox.test.tsx` - Need to create

**Tests Needed:**
- Rendering with different props
- User interactions (typing, selecting, keyboard nav)
- Cascading behavior (parent change resets children)
- Validation (on-blur, custom rules)
- Error states
- Loading states
- Custom value creation

#### E2E Tests (Optional)
Using Playwright or Cypress:

**Scenarios:**
- [ ] User selects from prefetched options
- [ ] User searches and selects from results
- [ ] User navigates with keyboard
- [ ] User creates custom value
- [ ] Cascading fields reset correctly
- [ ] Form submission with validation

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Success Criteria
- [ ] >85% line coverage
- [ ] >85% branch coverage
- [ ] >85% function coverage
- [ ] >85% statement coverage
- [ ] All edge cases covered
- [ ] All user workflows tested

## 4. Performance Profiling

### Goal
Verify <300ms p95 response time and optimal render performance.

### Tools
- Chrome DevTools Performance tab
- React DevTools Profiler
- Network tab for API timing

### Render Performance

1. **Profile Component Rendering**
   - Open React DevTools → Profiler
   - Start recording
   - Interact with component (type, select, navigate)
   - Stop recording
   - Analyze flame graph

2. **Metrics to Check**
   - [ ] Initial render time <100ms
   - [ ] Re-render time <50ms
   - [ ] No unnecessary re-renders
   - [ ] Smooth animations (60fps)

### API Performance

1. **Measure Response Times**
   - Open Chrome DevTools → Network tab
   - Interact with component
   - Record API call timings

2. **Metrics to Check**
   - [ ] p50 response time <150ms
   - [ ] p95 response time <300ms
   - [ ] p99 response time <500ms
   - [ ] Cache hit rate >70%

### Search Performance

1. **Measure Search Speed**
   - Add console.time/timeEnd in fuzzy-search.ts
   - Test with various dataset sizes

2. **Metrics to Check**
   - [ ] 100 items: <5ms
   - [ ] 500 items: <10ms
   - [ ] 1000 items: <20ms

### Optimization Strategies (if needed)
- Memoize expensive computations
- Virtualize long lists (react-window)
- Optimize fuzzy search threshold
- Reduce re-renders with React.memo
- Debounce more aggressively

### Success Criteria
- [ ] Initial render <100ms
- [ ] Re-render <50ms
- [ ] API p95 <300ms
- [ ] Search <10ms for 500 items
- [ ] Cache hit rate >70%

## 5. Cross-Browser Validation

### Goal
Ensure consistent behavior across all major browsers.

### Browsers to Test

#### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile
- [ ] iOS Safari (latest)
- [ ] Chrome Android (latest)

### Test Scenarios

For each browser:

1. **Visual Rendering**
   - [ ] Styles render correctly
   - [ ] Animations are smooth
   - [ ] Focus states visible
   - [ ] Popover positioning correct

2. **Functionality**
   - [ ] Typing works
   - [ ] Selecting options works
   - [ ] Keyboard navigation works
   - [ ] Cascading behavior works
   - [ ] Validation works

3. **Performance**
   - [ ] No lag when typing
   - [ ] Smooth scrolling in dropdown
   - [ ] Fast search results

4. **Mobile-Specific**
   - [ ] Touch interactions work
   - [ ] Virtual keyboard doesn't break layout
   - [ ] Responsive design works
   - [ ] Scrolling works correctly

### Testing Tools
- BrowserStack (cross-browser testing)
- Local device testing
- Chrome DevTools device emulation

### Success Criteria
- [ ] All browsers: Visual consistency
- [ ] All browsers: Full functionality
- [ ] All browsers: Good performance
- [ ] Mobile: Touch-friendly
- [ ] Mobile: Responsive layout

## 6. Load Testing

### Goal
Verify component handles 1000+ concurrent users.

### Tools
- Apache JMeter
- k6
- Artillery

### Test Scenarios

1. **API Load Test**
```bash
# Example with k6
k6 run load-test.js
```

**Metrics:**
- [ ] 100 concurrent users: <300ms p95
- [ ] 500 concurrent users: <500ms p95
- [ ] 1000 concurrent users: <1000ms p95
- [ ] No errors under load

2. **Cache Behavior Under Load**
- [ ] Cache hit rate remains >70%
- [ ] No cache corruption
- [ ] LRU eviction works correctly

3. **Server Resource Usage**
- [ ] CPU usage <80%
- [ ] Memory usage stable
- [ ] No memory leaks

### Success Criteria
- [ ] Handles 1000+ concurrent users
- [ ] Response times acceptable under load
- [ ] No errors or crashes
- [ ] Cache performs well

## Summary

### Completion Checklist

**Phase 3 Tasks:**
- [ ] Bundle size analysis complete
- [ ] Accessibility testing complete
- [ ] Test coverage >85%
- [ ] Performance profiling complete
- [ ] Cross-browser validation complete
- [ ] Load testing complete

**Documentation:**
- [x] API reference complete
- [x] Usage guide complete
- [x] Decision log complete
- [x] Testing guide complete

**Quality Gates:**
- [ ] Zero TypeScript errors
- [ ] Zero accessibility violations
- [ ] Performance budget met
- [ ] All tests passing
- [ ] Code review approved

### Next Steps

1. Run bundle analyzer
2. Conduct accessibility testing
3. Write comprehensive tests
4. Profile performance
5. Validate cross-browser
6. Conduct load testing
7. Address any issues found
8. Final code review
9. Deploy to production

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Radix UI Accessibility](https://www.radix-ui.com/primitives/docs/overview/accessibility)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/)
- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)

