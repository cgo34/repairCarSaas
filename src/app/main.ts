import { loadRuntimeConfig } from '@/shared/infrastructure/config/RuntimeConfig';

function renderStartupError(error: unknown): void {
  const root = document.getElementById('app');
  if (!root) return;

  const box = document.createElement('div');
  box.style.cssText = 'font-family: sans-serif; max-width: 560px; margin: 15vh auto; padding: 24px; border: 1px solid #d32f2f; border-radius: 8px;';

  const title = document.createElement('h2');
  title.textContent = "Impossible de demarrer l'application";
  title.style.color = '#d32f2f';

  const message = document.createElement('p');
  message.textContent = error instanceof Error ? error.message : String(error);

  box.append(title, message);
  root.replaceChildren(box);
}

async function start(): Promise<void> {
  try {
    await loadRuntimeConfig();
    await import('@/app/app');
  } catch (error) {
    console.error(error);
    renderStartupError(error);
  }
}

void start();
