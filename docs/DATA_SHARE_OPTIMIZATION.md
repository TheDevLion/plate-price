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


## 3. Commit-by-commit comparison (before vs after)

### Commit `7dca327` - ID strategy changed to base62 incremental IDs

What changed:
- Previous ID generation used long timestamp strings (`Date.now().toString()`).
- New ID generation uses a global counter in `localStorage` (`pp:id_counter`) and encodes the number in base62.

How base62 works in this project:
- Alphabet: `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` (62 symbols).
- Each new ID is generated from an integer counter (`1, 2, 3, ...`) and converted to base62.
- This keeps semantic uniqueness from the counter, but with shorter textual representation.
- Implementation references:
- `src/helpers/base62.ts` (`toBase62` / `fromBase62`)
- `src/helpers/idCounter.ts` (`getNextId`)

Base62 conversion examples:
- Decimal `10` -> Base62 `"a"`
- Decimal `35` -> Base62 `"z"`
- Decimal `36` -> Base62 `"A"`
- Decimal `61` -> Base62 `"Z"`
- Decimal `62` -> Base62 `"10"`
- Decimal `3844` (`62 * 62`) -> Base62 `"100"`

Why it matters for URL size:
- IDs are repeated in all relationships (`receipt`, `product`, `price`, `ingredient` references).
- Shorter IDs reduce raw JSON size and also improve compressed size.

Before:
```json
{
  "id": "1741029984123"
}
```

After:
```json
{
  "id": "b9"
}
```

---

### Commit `b00baf4` - Receipts moved from object records to tuple records

What changed:
- `TechnicalDatasheetRecord` changed from object shape to fixed-position tuple.

Before structure:
```ts
type TechnicalDatasheetRecord = {
  id: string;
  name: string;
}
```

After structure:
```ts
type TechnicalDatasheetRecord = [string, string]; // [id, name]
```

Before data example:
```json
[
  { "id": "a1", "name": "Burger Sheet" },
  { "id": "a2", "name": "Pizza Sheet" }
]
```

After data example:
```json
[
  ["a1", "Burger Sheet"],
  ["a2", "Pizza Sheet"]
]
```

Size/compression impact:
- Removes repeated key names (`"id"`, `"name"`) for every receipt entry.

---

### Commit `6fd2f32` - Products and product prices moved to tuples

What changed:
- `ProductPrice` changed from object to tuple.
- `Product` changed from object to tuple.
- Access helpers were introduced to keep call sites readable.

Before structures:
```ts
type ProductPrice = {
  id: string;
  description: string;
  value: number | "";
}

type Product = {
  id: string;
  name: string;
  quantity: number | "";
  unit: string;
  prices: ProductPrice[];
}
```

After structures:
```ts
type ProductPrice = [string, string, number | ""]; // [id, description, value]
type Product = [string, string, number | "", string, ProductPrice[]]; // [id, name, quantity, unit, prices]
```

Before data example:
```json
[
  {
    "id": "p1",
    "name": "Cheese",
    "quantity": 1000,
    "unit": "g",
    "prices": [
      { "id": "pr1", "description": "Wholesale", "value": 18.9 }
    ]
  }
]
```

After data example:
```json
[
  [
    "p1",
    "Cheese",
    1000,
    "g",
    [
      ["pr1", "Wholesale", 18.9]
    ]
  ]
]
```

Size/compression impact:
- Product catalog data is typically one of the largest blocks in payload.
- Removing object keys inside nested `prices` gives compounding savings.

---

### Commit `5232221` - Ingredients moved to tuples

What changed:
- `Ingredient` changed from object to tuple and UI/store logic was updated accordingly.

Before structure:
```ts
type Ingredient = {
  id: string;
  productId: string;
  priceId: string;
  quantity: number | "";
  unit: string;
  datasheetId: string;
}
```

After structure:
```ts
type Ingredient = [string, string, string, number | "", string, string];
// [id, productId, priceId, quantity, unit, datasheetId]
```

Before data example:
```json
[
  {
    "id": "i1",
    "productId": "p1",
    "priceId": "pr1",
    "quantity": 150,
    "unit": "g",
    "datasheetId": "a1"
  }
]
```

After data example:
```json
[
  ["i1", "p1", "pr1", 150, "g", "a1"]
]
```

Size/compression impact:
- Ingredients are usually the highest-volume list per datasheet.
- This commit delivers one of the biggest total reductions in shared payload length.

## 4. End-to-end payload comparison

Current export flow (optimized):

```json
{
  "receipts": "...",
  "products": "...",
  "ingredients": "..."
}
```

The app now serializes and compresses the direct object:

```ts
LZString.compressToEncodedURIComponent(JSON.stringify(data))
```

Hard shift:
- Import now expects only the direct object format.
- Old links using `{ v, t, data }` are not supported anymore.

Comparative conclusion:
- Before: larger payload due to verbose objects + long IDs.
- After: smaller payload due to tuple schemas + short base62 IDs.
- Result: more business data can fit into a single share URL before hitting practical URL length limits.
