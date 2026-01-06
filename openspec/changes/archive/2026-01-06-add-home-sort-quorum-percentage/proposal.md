# Change: Add home sort by quorum percentage

## Why
Users need to quickly identify initiatives closest to (or beyond) quorum without changing card visuals.

## What Changes
- Add a new home-page sort option: percentage of signatures collected vs quorum (descending).
- Treat missing/zero values as 0% for ordering.
- Keep existing card visuals unchanged; only sorting behavior changes.

## Impact
- Affected specs: home-list (new)
- Affected code: home filters/sorting component and sorting helper logic
