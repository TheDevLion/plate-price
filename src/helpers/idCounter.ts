import { toBase62 } from "./base62";

const STORAGE_KEY = "pp:id_counter";

export const getNextId = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  const current = raw ? Number(JSON.parse(raw)) || 0 : 0;
  const next = current + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return toBase62(next);
};
