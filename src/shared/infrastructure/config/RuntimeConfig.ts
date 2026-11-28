import { z } from 'zod';

const runtimeConfigSchema = z.object({
  environment: z.string().min(1),
  version: z.string().min(1).optional(),
  supabase: z.object({
    url: z.url(),
    publishableKey: z.string().min(1),
  }),
});

export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;

export class RuntimeConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeConfigError';
  }
}

export const RUNTIME_CONFIG_URL = '/config.json';

let currentConfig: RuntimeConfig | null = null;

export async function loadRuntimeConfig(
  fetchFn: typeof fetch = fetch,
  url: string = RUNTIME_CONFIG_URL,
): Promise<RuntimeConfig> {
  let response: Response;
  try {
    response = await fetchFn(url, { cache: 'no-store' });
  } catch {
    throw new RuntimeConfigError(`Impossible de charger ${url} (erreur reseau).`);
  }

  if (!response.ok) {
    throw new RuntimeConfigError(`Impossible de charger ${url} (HTTP ${response.status}).`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new RuntimeConfigError(`${url} n'est pas un JSON valide (fichier absent ou mal genere).`);
  }

  const parsed = runtimeConfigSchema.safeParse(payload);
  if (!parsed.success) {
    const details = parsed.error.issues.map((i) => `${i.path.join('.') || '(racine)'}: ${i.message}`).join('; ');
    throw new RuntimeConfigError(`Configuration invalide dans ${url} : ${details}`);
  }

  currentConfig = parsed.data;
  return currentConfig;
}

export function getRuntimeConfig(): RuntimeConfig {
  if (!currentConfig) {
    throw new RuntimeConfigError("La configuration runtime n'est pas chargee.");
  }
  return currentConfig;
}
