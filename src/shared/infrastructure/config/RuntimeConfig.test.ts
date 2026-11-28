import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  RuntimeConfigError,
  getRuntimeConfig,
  loadRuntimeConfig,
} from '@/shared/infrastructure/config/RuntimeConfig';

const validConfig = {
  environment: 'development',
  supabase: { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_example' },
};

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('RuntimeConfig', () => {
  afterEach(() => vi.restoreAllMocks());

  it('loads and exposes a valid configuration', async () => {
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(validConfig));

    const config = await loadRuntimeConfig(fetchFn);

    expect(config).toEqual(validConfig);
    expect(getRuntimeConfig()).toEqual(validConfig);
    expect(fetchFn).toHaveBeenCalledWith('/config.json', { cache: 'no-store' });
  });

  it('exposes the optional deployed version', async () => {
    const withVersion = { ...validConfig, version: 'v1.2.3' };
    const fetchFn = vi.fn().mockResolvedValue(jsonResponse(withVersion));

    const config = await loadRuntimeConfig(fetchFn);

    expect(config.version).toBe('v1.2.3');
  });

  it('rejects a configuration with a missing key or invalid url', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      jsonResponse({ environment: 'development', supabase: { url: 'not-a-url' } }),
    );

    await expect(loadRuntimeConfig(fetchFn)).rejects.toThrow(/Configuration invalide/);
  });

  it('fails explicitly when the file is missing (HTTP error)', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('', { status: 404 }));

    await expect(loadRuntimeConfig(fetchFn)).rejects.toThrow('HTTP 404');
  });

  it('fails explicitly when the response is not JSON (SPA fallback)', async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response('<html></html>', { status: 200 }));

    await expect(loadRuntimeConfig(fetchFn)).rejects.toBeInstanceOf(RuntimeConfigError);
  });

  it('fails explicitly on network errors', async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError('offline'));

    await expect(loadRuntimeConfig(fetchFn)).rejects.toThrow('erreur reseau');
  });
});
