## 1. Use auto increment global ID in base62 strategy

### Overview
IDs across the app are now generated using a single global auto-increment counter stored in `localStorage`, encoded in base62 to keep them short.

### How it works
- `localStorage` key: `pp:id_counter`
- `getNextId()` increments the counter and returns a base62 string
- Base62 alphabet: `0-9a-zA-Z`

### Implementation
- Helper: `src/helpers/idCounter.ts`
- Base62 codec: `src/helpers/base62.ts`

## 2. JSON structure of stored data keys