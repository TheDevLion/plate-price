import LZString from "lz-string";
import { STORE_APP_KEYS } from "../constants";

// Update constants as needed in project
export const QUERY_PARAM_KEY = "data" 
export const PAGE_TO_REDIRECT = "/"

export function exportLocalStorageToURL(): string {
  try {
    const data: Record<string, unknown> = {};

    Object.keys(STORE_APP_KEYS).forEach((k: string) => {
      const v = localStorage.getItem(k);
      if (v != null) data[k] = JSON.parse(v);
    });

    // Keep payload minimal to maximize URL capacity.
    const json = JSON.stringify(data);
    return LZString.compressToEncodedURIComponent(json);
  } catch (err) {
    console.log(err)
    return "";
  }
}

export function importLocalStorageFromURL(encoded: string): boolean {
  try {
    if (!encoded) return false;

    const normalized = encoded.replace(/ /g, "+");
    const json = LZString.decompressFromEncodedURIComponent(normalized);
    if (!json) return false;

    let payload;
    try {
      payload = JSON.parse(json);
    } catch (err) {
      console.log(err)
      return false;
    }

    if (!payload || typeof payload !== "object") return false;
    const incoming = payload;
    
    Object.keys(incoming).forEach((key) => {
      try {
        localStorage.setItem(key, JSON.stringify(incoming[key]));
      } catch (err) {console.log(err)}
    });
    
    return true;
  } catch (err) {
    console.log(err)
    return false;
  }
}
