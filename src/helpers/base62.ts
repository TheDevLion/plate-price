const BASE62_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE62_MAP = new Map(BASE62_ALPHABET.split("").map((c, i) => [c, i]));

export const toBase62 = (value: number) => {
  if (value === 0) return "0";
  let num = value;
  let out = "";
  while (num > 0) {
    out = BASE62_ALPHABET[num % 62] + out;
    num = Math.floor(num / 62);
  }
  return out;
};

export const fromBase62 = (input: string) => {
  if (!input) return null;
  let value = 0;
  for (const char of input) {
    const digit = BASE62_MAP.get(char);
    if (digit == null) return null;
    value = value * 62 + digit;
  }
  return value;
};
