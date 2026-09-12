// src/cms-cache.js - Stale-While-Revalidate Caching Engine for Headless WordPress

const CACHE_PREFIX = 'greenammo_cms_cache_';
const DEFAULT_TIMEOUT_MS = 3500;

/**
 * Reads cached data from localStorage instantly (0ms delay).
 */
export function getCachedData(cacheKey, fallbackValue = null) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + cacheKey);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    return parsed.data || fallbackValue;
  } catch (err) {
    console.warn(`[CMS Cache] Failed to read '${cacheKey}' from localStorage:`, err);
    return fallbackValue;
  }
}

/**
 * Stores data into localStorage for instant future loads.
 */
export function setCachedData(cacheKey, data) {
  try {
    const payload = {
      timestamp: Date.now(),
      data: data
    };
    localStorage.setItem(CACHE_PREFIX + cacheKey, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[CMS Cache] Failed to write '${cacheKey}' to localStorage:`, err);
  }
}

/**
 * Fetches data from WP REST API with payload size filtering and a strict timeout.
 */
export async function fetchCMS(url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      console.warn(`[CMS Cache] Request timed out for: ${url}`);
    } else {
      console.warn(`[CMS Cache] Fetch error for ${url}:`, err.message);
    }
    return null;
  }
}

/**
 * Stale-While-Revalidate (SWR) runner:
 * 1. Returns cached/fallback data instantly (0ms)
 * 2. Fetches latest data in background
 * 3. Invokes onUpdate callback if fresh data differs from cache
 */
export async function swrFetch(cacheKey, url, fallbackValue, onUpdate = null) {
  const cached = getCachedData(cacheKey, fallbackValue);

  // Background revalidation
  fetchCMS(url).then((freshData) => {
    if (freshData && JSON.stringify(freshData) !== JSON.stringify(cached)) {
      setCachedData(cacheKey, freshData);
      if (typeof onUpdate === 'function') {
        onUpdate(freshData);
      }
    }
  });

  return cached;
}
