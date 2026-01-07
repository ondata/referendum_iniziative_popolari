# Fix schema.org WebSite Markup

## Todo

- [x] Update `SearchActionSchema` interface to include `url` and `potentialAction`
- [x] Fix `generateSearchActionSchema()` to nest `target` and `query-input` inside `potentialAction`
- [x] Verify the fix resolves schema.org validation warnings

## Plan

**Problem**: The WebSite schema has `target` and `query-input` at the wrong nesting level, causing schema.org validation warnings.

**Solution**: Restructure the JSON-LD to:
```json
{
  "@type": "WebSite",
  "url": "...",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {...},
    "query-input": "..."
  }
}
```

**Files to change**:
- `src/lib/json-ld-schemas.ts` (interface + function)

**Impact**: Minimal - only changes the structure of the JSON-LD output, no runtime behavior changes.

---

## Review

**Changes made**:
1. Updated `SearchActionSchema` interface to include `url` property and `potentialAction` object
2. Modified `generateSearchActionSchema()` to return correctly nested structure with `SearchAction` type
3. Added `url: baseUrl` field to WebSite schema

**Result**: The homepage now generates valid schema.org WebSite markup with proper SearchAction nesting. This should:
- Resolve schema.org validation warnings
- Improve chances of Google showing sitelinks search box
- Make the markup fully compliant with schema.org specification

**Files changed**: 
- `src/lib/json-ld-schemas.ts` (lines 39-51, 116-130)
- `LOG.md` (added entry for 2026-01-07)

**No breaking changes** - only affects JSON-LD metadata output, no functional changes to site behavior.
