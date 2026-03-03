import LZString from "lz-string";

const rawArg = process.argv.slice(2)[0];
const maxChars = Number(rawArg || "5000");

if (!Number.isFinite(maxChars) || maxChars <= 0) {
  console.error("Usage: node scripts/storage-benchmark.js <max-chars>");
  process.exit(1);
}

// Hook for future optimization comparison
const encoders = {
  json: (payload) => JSON.stringify(payload),
  compressed: (payload) => LZString.compressToEncodedURIComponent(JSON.stringify(payload)),
  // optimized: (payload) => "", // TODO: plug optimized JSON encoder here
};

const datasheetNames = [
  "Grilled chicken",
  "Pasta with sauce",
  "House salad",
  "Chocolate cake",
  "Vegetable soup",
  "Artisan burger",
  "Margherita pizza",
  "Mushroom risotto",
  "Chicken pie",
  "Beef pancakes",
  "Creamy polenta",
  "Shrimp stir fry",
  "BBQ pulled pork",
  "Vegetable lasagna",
  "Lemon tart",
  "Coconut curry",
  "Beef stew",
  "Roasted vegetables",
  "Garlic bread",
  "Chicken parmesan",
  "Fish and chips",
  "Chicken noodle soup",
  "Classic pancakes",
  "Apple crumble",
  "Greek salad",
  "Tuna casserole",
  "Stuffed peppers",
  "French onion soup",
  "Shepherds pie",
  "Veggie burrito",
  "Pesto pasta",
  "Beef tacos",
  "Chicken fajitas",
  "Mashed potatoes",
  "Roast turkey",
  "Eggplant parm",
  "Clam chowder",
  "Banana bread",
  "Quiche lorraine",
  "Tomato basil soup",
  "Crispy tofu bowl",
  "Chicken salad",
  "Caesar salad",
  "Veggie omelet",
  "Spinach lasagna",
  "Chili con carne",
  "Pumpkin soup",
  "Pork schnitzel",
  "BBQ ribs",
  "Chicken stir fry",
];

const productNames = [
  "Chicken breast",
  "Ground beef",
  "Wheat flour",
  "Granulated sugar",
  "Whole milk",
  "Egg",
  "Butter",
  "Soybean oil",
  "Mozzarella cheese",
  "Tomato",
  "Onion",
  "Garlic",
  "Rice",
  "Beans",
  "Pasta",
  "Salt",
  "Black pepper",
  "Carrot",
  "Potato",
  "Heavy cream",
  "Baking powder",
  "Cocoa powder",
  "Olive oil",
  "Tomato sauce",
  "Ham",
  "Turkey breast",
  "Sausage",
  "Bacon",
  "Corn",
  "Peas",
  "Chicken thighs",
  "Pork loin",
  "Beef chuck",
  "Shrimp",
  "Salmon fillet",
  "Tuna",
  "Canned tomatoes",
  "Green beans",
  "Bell pepper",
  "Mushrooms",
  "Zucchini",
  "Eggplant",
  "Spinach",
  "Lettuce",
  "Cucumber",
  "Parsley",
  "Cilantro",
  "Basil",
  "Oregano",
  "Thyme",
  "Rosemary",
  "Chili powder",
  "Paprika",
  "Cumin",
  "Coriander",
  "Bay leaf",
  "Yeast",
  "Brown sugar",
  "Honey",
  "Maple syrup",
  "Vinegar",
  "Lemon",
  "Lime",
  "Orange",
  "Apples",
  "Bananas",
  "Strawberries",
  "Blueberries",
  "Vanilla extract",
  "Baking soda",
  "Cornstarch",
  "Bread crumbs",
  "Parmesan cheese",
  "Cheddar cheese",
  "Greek yogurt",
  "Sour cream",
  "Mayonnaise",
  "Mustard",
  "Ketchup",
  "Soy sauce",
  "Worcestershire sauce",
  "Hot sauce",
  "Pickles",
  "Olives",
  "Almonds",
  "Peanuts",
  "Cashews",
  "Coconut milk",
  "Chicken stock",
  "Beef stock",
  "Vegetable stock",
  "Flour tortillas",
  "Bread loaf",
  "Burger buns",
  "Pizza dough",
  "Couscous",
  "Quinoa",
  "Oats",
  "Granola",
  "Dark chocolate",
  "White chocolate",
  "Raisins",
  "Dried cranberries",
];

const priceDescriptions = [
  "Wholesale",
  "Retail",
  "Supplier A",
  "Supplier B",
  "Promo",
  "Local market",
  "Organic",
  "Bulk pack",
  "Seasonal",
  "Frozen",
  "Fresh",
  "Imported",
  "Store brand",
  "Premium",
  "Budget",
  "Direct farm",
  "Wholesale tier 1",
  "Wholesale tier 2",
  "Discount club",
  "Online price",
];

const units = ["kg", "g", "lb", "oz", "L", "mL", "unit", "box", "qt", "gal"];
const weightUnits = new Set(["kg", "g", "lb", "oz"]);
const volumeUnits = new Set(["L", "mL", "qt", "gal"]);

const productQuantities = {
  weight: [0.5, 1, 2, 5],
  volume: [250, 500, 1000, 1500],
  random: [1, 2, 6, 12],
};

const ingredientQuantities = {
  weight: [0.05, 0.1, 0.2, 0.25, 0.5],
  volume: [10, 30, 50, 100, 200],
  random: [1, 2, 3],
};

const unitCategory = (unit) => {
  if (weightUnits.has(unit)) return "weight";
  if (volumeUnits.has(unit)) return "volume";
  return "random";
};

const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const toBase62 = (value) => {
  if (value === 0) return "0";
  let num = value;
  let out = "";
  while (num > 0) {
    out = BASE62_ALPHABET[num % 62] + out;
    num = Math.floor(num / 62);
  }
  return out;
};

const makePayloadLegacy = ({ sheets, products, ingredients, prices = 1 }) => {
  const receipts = [];
  const prods = [];
  const ings = [];

  for (let i = 0; i < sheets; i++) {
    receipts.push({
      id: String(1700000000000 + i),
      name: datasheetNames[i % datasheetNames.length],
    });
  }

  for (let i = 0; i < products; i++) {
    const priceList = [];
    const unit = units[i % units.length];
    const category = unitCategory(unit);
    const quantityPool = productQuantities[category];
    const quantity = quantityPool[i % quantityPool.length];

    for (let j = 0; j < prices; j++) {
      const desc = priceDescriptions[(i + j) % priceDescriptions.length];
      const base = 3.5 + (i % 10) * 1.2 + j * 0.9;
      priceList.push({
        id: String(1700001000000 + i * 10 + j),
        description: desc,
        value: Math.round(base * 100) / 100,
      });
    }

    prods.push({
      id: String(1700002000000 + i),
      name: productNames[i % productNames.length],
      quantity,
      unit,
      prices: priceList,
    });
  }

  for (let i = 0; i < ingredients; i++) {
    const prod = prods[i % Math.max(1, prods.length)];
    const productId = prod?.id ?? "1700002000000";
    const priceId = prod?.prices?.[0]?.id ?? "1700001000000";
    const datasheetId = receipts[i % Math.max(1, receipts.length)]?.id ?? "1700000000000";
    const category = unitCategory(prod?.unit ?? "kg");
    const qtyPool = ingredientQuantities[category];
    const quantity = qtyPool[i % qtyPool.length];

    ings.push({
      id: String(1700003000000 + i),
      productId,
      priceId,
      quantity,
      unit: prod?.unit ?? "kg",
      datasheetId,
    });
  }

  return {
    v: 1,
    t: 1700004000000,
    data: {
      receipts,
      products: prods,
      ingredients: ings,
    },
  };
};

const makePayloadOptimized = ({ sheets, products, ingredients, prices = 1 }) => {
  const receipts = [];
  const prods = [];
  const ings = [];

  for (let i = 0; i < sheets; i++) {
    const receiptId = toBase62(i + 1);
    receipts.push([receiptId, datasheetNames[i % datasheetNames.length]]);
  }

  for (let i = 0; i < products; i++) {
    const priceList = [];
    const unit = units[i % units.length];
    const category = unitCategory(unit);
    const quantityPool = productQuantities[category];
    const quantity = quantityPool[i % quantityPool.length];
    const productId = toBase62(10_000 + i + 1);

    for (let j = 0; j < prices; j++) {
      const desc = priceDescriptions[(i + j) % priceDescriptions.length];
      const base = 3.5 + (i % 10) * 1.2 + j * 0.9;
      const priceId = toBase62(100_000 + i * 10 + j + 1);
      priceList.push([priceId, desc, Math.round(base * 100) / 100]);
    }

    prods.push([
      productId,
      productNames[i % productNames.length],
      quantity,
      unit,
      priceList,
    ]);
  }

  for (let i = 0; i < ingredients; i++) {
    const prod = prods[i % Math.max(1, prods.length)];
    const productId = prod ? prod[0] : toBase62(10_000);
    const firstPrice = prod && prod[4] && prod[4][0] ? prod[4][0] : null;
    const priceId = firstPrice ? firstPrice[0] : toBase62(100_000);
    const receipt = receipts[i % Math.max(1, receipts.length)];
    const datasheetId = receipt ? receipt[0] : toBase62(1);
    const category = unitCategory(prod ? prod[3] : "kg");
    const qtyPool = ingredientQuantities[category];
    const quantity = qtyPool[i % qtyPool.length];

    ings.push([
      toBase62(200_000 + i + 1),
      productId,
      priceId,
      quantity,
      prod ? prod[3] : "kg",
      datasheetId,
    ]);
  }

  return {
    receipts,
    products: prods,
    ingredients: ings,
  };
};

const lengthFor = (payload, encoder) => encoder(payload).length;

const fits = (payload, encoder) => lengthFor(payload, encoder) <= maxChars;

const findMaxCount = (makePayloadForCount, encoder) => {
  let low = 0;
  let high = 1;
  while (fits(makePayloadForCount(high), encoder)) {
    low = high;
    high *= 2;
    if (high > 1_000_000) break;
  }

  while (low + 1 < high) {
    const mid = Math.floor((low + high) / 2);
    if (fits(makePayloadForCount(mid), encoder)) low = mid;
    else high = mid;
  }
  return low;
};

const report = (label, jsonValue, compressedValue) => {
  console.log(`${label.padEnd(24)} JSON: ${String(jsonValue).padStart(8)} | LZ: ${String(compressedValue).padStart(8)}`);
};

const avgPerItem = (makePayload, kind, count) => {
  const make = (n) => {
    if (kind === "receipts") return makePayload({ sheets: n, products: 0, ingredients: 0 });
    if (kind === "products") return makePayload({ sheets: 0, products: n, ingredients: 0 });
    return makePayload({ sheets: 0, products: 0, ingredients: n });
  };
  const base = make(0);
  const withN = make(count);
  const jsonDelta = encoders.json(withN).length - encoders.json(base).length;
  const lzDelta = encoders.compressed(withN).length - encoders.compressed(base).length;
  return { json: jsonDelta / count, lz: lzDelta / count };
};

const runSeparate = (makePayload) => {
  const maxReceiptsJson = findMaxCount(
    (count) => makePayload({ sheets: count, products: 0, ingredients: 0 }),
    encoders.json
  );
  const maxReceiptsLz = findMaxCount(
    (count) => makePayload({ sheets: count, products: 0, ingredients: 0 }),
    encoders.compressed
  );

  const maxProductsJson = findMaxCount(
    (count) => makePayload({ sheets: 0, products: count, ingredients: 0 }),
    encoders.json
  );
  const maxProductsLz = findMaxCount(
    (count) => makePayload({ sheets: 0, products: count, ingredients: 0 }),
    encoders.compressed
  );

  const maxIngredientsJson = findMaxCount(
    (count) => makePayload({ sheets: 0, products: 0, ingredients: count }),
    encoders.json
  );
  const maxIngredientsLz = findMaxCount(
    (count) => makePayload({ sheets: 0, products: 0, ingredients: count }),
    encoders.compressed
  );

  console.log("\nSeparate (one collection at a time)");
  report("receipts", maxReceiptsJson, maxReceiptsLz);
  report("products", maxProductsJson, maxProductsLz);
  report("ingredients", maxIngredientsJson, maxIngredientsLz);
};

const avgPerBlock = (makePayload, count) => {
  const base = makePayload({ sheets: 0, products: 0, ingredients: 0 });
  const withN = makePayload({ sheets: count, products: count, ingredients: count });
  const jsonDelta = encoders.json(withN).length - encoders.json(base).length;
  const lzDelta = encoders.compressed(withN).length - encoders.compressed(base).length;
  return { json: jsonDelta / count, lz: lzDelta / count };
};

const runAverages = (makePayload) => {
  const N = 1000;
  const receipts = avgPerItem(makePayload, "receipts", N);
  const products = avgPerItem(makePayload, "products", N);
  const ingredients = avgPerItem(makePayload, "ingredients", N);
  const block = avgPerBlock(makePayload, N);

  console.log(`\nAverage chars per item (N=${N})`);
  report("receipts", receipts.json.toFixed(2), receipts.lz.toFixed(2));
  report("products", products.json.toFixed(2), products.lz.toFixed(2));
  report("ingredients", ingredients.json.toFixed(2), ingredients.lz.toFixed(2));

  console.log(`\nAverage chars per block (1,1,1; N=${N})`);
  report("block", block.json.toFixed(2), block.lz.toFixed(2));

  return { receipts, products, ingredients, block };
};

const runMixed = (makePayload) => {
  const base = { sheets: 1, products: 1, ingredients: 1 };

  const maxMultiplierJson = findMaxCount(
    (mult) => makePayload({
      sheets: base.sheets * mult,
      products: base.products * mult,
      ingredients: base.ingredients * mult,
    }),
    encoders.json
  );

  const maxMultiplierLz = findMaxCount(
    (mult) => makePayload({
      sheets: base.sheets * mult,
      products: base.products * mult,
      ingredients: base.ingredients * mult,
    }),
    encoders.compressed
  );

  console.log("\nMax combinations (1,1,1 base; scaled together)");
  report("total combos (1,1,1)", maxMultiplierJson, maxMultiplierLz);

  return { maxMultiplierJson, maxMultiplierLz };
};

const runEstimateVsActual = (makePayload, averages) => {
  const N = 100;
  const basePayload = makePayload({ sheets: 0, products: 0, ingredients: 0 });
  const baseJson = encoders.json(basePayload).length;
  const baseLz = encoders.compressed(basePayload).length;

  const estimateJson =
    baseJson +
    N * (averages.receipts.json + averages.products.json + averages.ingredients.json);
  const estimateLz =
    baseLz +
    N * (averages.receipts.lz + averages.products.lz + averages.ingredients.lz);

  const actualPayload = makePayload({ sheets: N, products: N, ingredients: N });
  const actualJson = encoders.json(actualPayload).length;
  const actualLz = encoders.compressed(actualPayload).length;

  console.log(`\nEstimate vs actual (1,1,1 x ${N})`);
  report("estimated length", estimateJson.toFixed(0), estimateLz.toFixed(0));
  report("actual length", actualJson, actualLz);
};

const runSuite = (name, makePayload) => {
  console.log(`\n============================================================`);
  console.log(`Benchmark profile: ${name}`);
  console.log(`============================================================`);
  runSeparate(makePayload);
  runMixed(makePayload);
  const averages = runAverages(makePayload);
  runEstimateVsActual(makePayload, averages);
};

console.log(`Storage benchmark (max chars: ${maxChars})`);
runSuite("legacy (object + envelope v/t/data + long numeric IDs)", makePayloadLegacy);
runSuite("optimized (direct keys + tuples + base62 IDs)", makePayloadOptimized);

console.log("\nTip:");
console.log("  Pass max chars as a single argument, e.g.: node scripts/storage-benchmark.js 5000");
console.log("  LZ uses LZString.compressToEncodedURIComponent over JSON.");
