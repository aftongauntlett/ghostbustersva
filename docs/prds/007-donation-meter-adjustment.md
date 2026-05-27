# PRD 007: Donation Meter Adjustment

**Status:** ready-for-implementation
**Author:** cookie
**Date:** 2026-05-26

---

## Goal

Remove the matching donations needle from the meter and reduce the target donation amount to 25000.
Adjust the values on the meter so it reaches 30000 and no longer maxes out at the target
donation amount.

Remove the total plus matching arc band and adjust the sizes of the other arc bands to compensate.

---

## Acceptance Criteria

- [ ] `npm run check` passes (typecheck, lint, format, tests)
- [ ] `npm run build` passes
- [ ] donation meter has 3 arc bands and corresponding needles
  - [ ] one for make a wish donations
  - [ ] one for other donations
  - [ ] one for total donations
- [ ] danger sector runs from 20000 to 30000
