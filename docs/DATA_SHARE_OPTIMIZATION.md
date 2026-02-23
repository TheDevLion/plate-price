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

### Overview
Receipts, products (including product prices) and ingredients  are now stored as positional arrays instead of objects to reduce size and make the schema explicit.

### Receipts format (v2)
- Each receipt is stored as `[id, name]`
- The in-memory type is `TechnicalDatasheetRecord = [string, string]`

### Products format (v2)
- Each product is stored as `[id, name, quantity, unit, prices]`
- Each price is stored as `[id, description, value]`
- In-memory types:
  - `Product = [string, string, number | \"\", string, ProductPrice[]]`
  - `ProductPrice = [string, string, number | \"\"]`

### Ingredients format (v2)
- Each ingredient is stored as `[id, productId, priceId, quantity, unit, datasheetId]`
- In-memory type: `Ingredient = [string, string, string, number | \"\", string, string]`

