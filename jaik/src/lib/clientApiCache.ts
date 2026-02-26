"use client";

import axios, { type AxiosResponse } from "axios";

type CacheEntry<T> = {
  expiresAt: number;
  promise: Promise<AxiosResponse<T>>;
};

const apiCache = new Map<string, CacheEntry<unknown>>();

export const cachedGet = <T = any>(
  url: string,
  ttlMs = 5 * 60 * 1000
): Promise<AxiosResponse<T>> => {
  const now = Date.now();
  const cached = apiCache.get(url);

  if (cached && cached.expiresAt > now) {
    return cached.promise as Promise<AxiosResponse<T>>;
  }

  const promise = axios.get<T>(url);
  apiCache.set(url, {
    expiresAt: now + ttlMs,
    promise: promise as Promise<AxiosResponse<unknown>>,
  });

  promise.catch(() => {
    const latest = apiCache.get(url);
    if (latest?.promise === (promise as Promise<AxiosResponse<unknown>>)) {
      apiCache.delete(url);
    }
  });

  return promise;
};
