import { useEffect, useState } from 'react';
import { config } from '../config';

/**
 * Dynamic pricing store.
 *
 * The real price lives in the admin panel (CI4 `settings` table) and is
 * served by GET /api/settings. Components read it through the usePricing()
 * hook so they re-render the moment the price arrives/changes.
 *
 * - localStorage cache (5 min TTL) → visitors see the right price instantly
 *   on repeat visits, then revalidate in the background.
 * - config.PRODUCT_PRICE / config.ORIGINAL_PRICE are kept in sync so any
 *   legacy code reading the config still shows the live value.
 */

const CACHE_KEY = 'gn_pricing_cache_v1';
const TTL_MS = 5 * 60 * 1000;

let store = {
  price: config.PRODUCT_PRICE,
  originalPrice: config.ORIGINAL_PRICE,
};
let loadedAt = 0;
let inflight = null;
const listeners = new Set();

const formatPrice = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? '');
  return num % 1 === 0 ? String(num) : num.toFixed(2);
};

const applySettings = (productPrice, originalPrice) => {
  store = {
    price: formatPrice(productPrice),
    originalPrice: originalPrice ? formatPrice(originalPrice) : store.originalPrice,
  };
  loadedAt = Date.now();
  config.PRODUCT_PRICE = store.price;
  config.ORIGINAL_PRICE = store.originalPrice;
  listeners.forEach((notify) => notify(store));
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.price) return null;
    return data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, at: Date.now() }));
  } catch {
    /* storage full / private mode — ignore */
  }
};

export const loadPricing = () => {
  // Fresh data already in memory — nothing to do.
  if (loadedAt && Date.now() - loadedAt < TTL_MS) return Promise.resolve(store);
  if (inflight) return inflight;

  inflight = fetch(`${config.API_BASE_URL}/settings`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data && data.ok && data.product_price) {
        applySettings(data.product_price, data.original_price);
        writeCache({ price: store.price, originalPrice: store.originalPrice });
      }
      return store;
    })
    .catch(() => store)
    .finally(() => {
      inflight = null;
    });

  return inflight;
};

/**
 * Subscribe a component to the live price.
 * Returns { price, originalPrice } as strings (e.g. "99", "999").
 */
export const usePricing = () => {
  const [pricing, setPricing] = useState(() => {
    const cached = readCache();
    const initial = cached
      ? { price: formatPrice(cached.price), originalPrice: formatPrice(cached.originalPrice) }
      : store;
    // Sync config immediately so the first render already shows the cached price.
    config.PRODUCT_PRICE = initial.price;
    config.ORIGINAL_PRICE = initial.originalPrice;
    return initial;
  });

  useEffect(() => {
    listeners.add(setPricing);
    loadPricing();
    return () => {
      listeners.delete(setPricing);
    };
  }, []);

  return pricing;
};

export default usePricing;
