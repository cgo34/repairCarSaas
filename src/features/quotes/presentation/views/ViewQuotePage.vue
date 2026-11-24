<template>
  <MainLayout>
    <v-container
      fluid
      class="pa-0 mt-4 view-quote-container"
      :class="{ 'is-dark': isDark }"
    >
      <!-- Header -->
      <div class="page-header mx-3 mb-3 px-4 py-3 d-flex align-center justify-space-between flex-wrap ga-2">
        <div class="d-flex align-center ga-3 min-w-0">
          <v-btn
            icon
            variant="outlined"
            size="small"
            class="header-back"
            @click="$router.back()"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <div class="ml-3">
            <div class="text-h6 font-weight-bold">
              Devis n° {{ quote?.quoteNumber ?? '' }}
            </div>
            <div class="text-caption text-medium-emphasis">
              <template v-if="quote?.createdAt">
                Créé le {{ formatDate(quote.createdAt) }}
              </template>
              <template v-if="quote?.endDate">
                · Valable jusqu'au {{ formatDate(quote.endDate) }}
              </template>
            </div>
          </div>
          <v-chip
            v-if="quote"
            class="ml-3"
            :color="statusInfo.color"
            size="small"
            variant="tonal"
          >
            {{ statusInfo.label }}
          </v-chip>
          <v-chip
            v-if="quote?.convertToInvoice"
            class="ml-2"
            color="success"
            size="small"
            variant="tonal"
            prepend-icon="mdi-receipt-text-check-outline"
          >
            Converti en facture
          </v-chip>
        </div>

        <div class="d-flex align-center ga-2 flex-wrap">
          <v-btn
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-pencil-outline"
            :disabled="isLocked"
            @click="onEditBtnClick"
          >
            Modifier le devis
          </v-btn>
          <v-btn
            variant="outlined"
            height="40"
            class="px-5 header-btn"
            prepend-icon="mdi-download-outline"
            :disabled="!pdfUrl"
            @click="onDownloadBtnClick"
          >
            Télécharger
          </v-btn>
          <v-btn
            v-if="!isFreePlan"
            color="primary"
            variant="flat"
            height="40"
            class="px-5"
            prepend-icon="mdi-send"
            :loading="sending"
            @click="onSendBtnClick"
          >
            Envoyer
          </v-btn>
        </div>
      </div>

      <!-- Bandeau verrouillé -->
      <div
        v-if="isLocked"
        class="lock-banner mx-3 mb-3"
      >
        <v-icon
          size="20"
          icon="mdi-lock-outline"
        />
        <span>
          Ce devis est {{ quote?.convertToInvoice ? 'accepté et converti en facture' : 'accepté' }} :
          il n'est plus modifiable. Tu peux consulter, télécharger ou renvoyer le PDF.
        </span>
      </div>

      <div class="view-layout mx-3 pb-6">
        <!-- Viewer PDF -->
        <div class="q-card viewer">
          <div class="viewer-bar">
            <span class="text-subtitle-1 font-weight-bold">Aperçu du PDF</span>
            <div class="zoom-controls">
              <button
                type="button"
                class="zoom-btn"
                :disabled="zoom <= ZOOM_MIN"
                @click="changeZoom(-ZOOM_STEP)"
              >
                <v-icon size="16">
                  mdi-minus
                </v-icon>
              </button>
              <div class="zoom-value">
                {{ zoom }}%
              </div>
              <button
                type="button"
                class="zoom-btn"
                :disabled="zoom >= ZOOM_MAX"
                @click="changeZoom(ZOOM_STEP)"
              >
                <v-icon size="16">
                  mdi-plus
                </v-icon>
              </button>
              <button
                type="button"
                class="zoom-btn"
                :class="{ active: fit }"
                @click="fitPage"
              >
                <v-icon size="16">
                  mdi-arrow-expand-all
                </v-icon>
              </button>
            </div>
          </div>
          <div
            ref="stageRef"
            class="viewer-stage"
          >
            <div
              v-if="pdfUrl"
              class="pages"
            >
              <canvas
                v-for="n in pageCount"
                :key="n"
                :ref="(el) => setCanvas(el as HTMLCanvasElement | null, n)"
                class="pdf-page"
              />
            </div>
            <v-progress-circular
              v-else
              indeterminate
              color="primary"
              class="mt-16"
            />
          </div>
        </div>

        <!-- Panneau latéral -->
        <div class="side">
          <div class="q-card pa-5">
            <div class="text-caption text-medium-emphasis">
              Total TTC
            </div>
            <div class="recap-total text-primary">
              {{ money(total) }}
            </div>
            <div class="mini-row mt-3">
              <span class="text-medium-emphasis">Total H.T.</span>
              <span>{{ money(subtotal) }}</span>
            </div>
            <div
              v-if="totalDegarnissage"
              class="mini-row"
            >
              <span class="text-medium-emphasis">Dégarnissage</span>
              <span>{{ money(totalDegarnissage) }}</span>
            </div>
            <div
              v-if="taxRate"
              class="mini-row"
            >
              <span class="text-medium-emphasis">TVA ({{ taxRate }}%)</span>
              <span>{{ money(totalTax) }}</span>
            </div>
          </div>

          <div class="q-card pa-5">
            <div class="text-subtitle-1 font-weight-bold mb-3">
              Informations
            </div>
            <div class="mini-row no-border">
              <span class="text-medium-emphasis">Client</span>
              <strong>{{ quote?.garage?.name ?? quote?.garageName ?? '—' }}</strong>
            </div>
            <div class="mini-row">
              <span class="text-medium-emphasis">Véhicule</span>
              <strong>{{ vehicle }}</strong>
            </div>
            <div class="mini-row">
              <span class="text-medium-emphasis">Technicien</span>
              <strong>{{ technician }}</strong>
            </div>
          </div>

          <div class="q-card pa-5">
            <div class="text-subtitle-1 font-weight-bold mb-3">
              Historique
            </div>
            <v-timeline
              side="end"
              align="start"
              density="compact"
              line-thickness="2"
              truncate-line="both"
            >
              <v-timeline-item
                v-for="e in history"
                :key="e.label"
                :dot-color="e.ok ? 'success' : 'primary'"
                size="x-small"
              >
                <div class="font-weight-bold">
                  {{ e.label }}
                </div>
                <div
                  v-if="e.date"
                  class="text-caption text-medium-emphasis"
                >
                  {{ e.date }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </div>
      </div>
    </v-container>
  </MainLayout>

  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    timeout="4000"
    location="bottom right"
  >
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { useViewQuotePageDependencies } from '@/features/quotes/composition/useViewQuotePageDependencies';
import MainLayout from '@/app/layouts/MainLayout.vue';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { getDocument, GlobalWorkerOptions, type PDFDocumentProxy } from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { EMPTY_QUOTE_ERROR } from '@/features/quotes/application/useCases/SendQuoteUseCase';
import { getSelectedQuoteGuid } from '@/features/quotes/presentation/utils/quoteSelection';

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const { useViewQuoteState, authState } = useViewQuotePageDependencies();
const { isFreePlan } = authState;
const {
  init,
  sendQuote,
  downloadPdf,
  quote,
  pdfUrl,
  subtotal,
  totalDegarnissage,
  taxRate,
  totalTax,
  total,
} = useViewQuoteState;

const router = useRouter();
const theme = useTheme();
const isDark = computed(() => theme.current.value.dark);

const sending = ref(false);

const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const ZOOM_STEP = 25;
const zoom = ref(100);
const fit = ref(false);
const changeZoom = (delta: number) => {
  fit.value = false;
  zoom.value = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom.value + delta));
};
const fitPage = () => {
  fit.value = !fit.value;
  if (!fit.value) zoom.value = 100;
};

const BASE_WIDTH = 620;
const stageRef = ref<HTMLElement | null>(null);
const pageCount = ref(0);
const canvases = new Map<number, HTMLCanvasElement>();
let pdfDoc: PDFDocumentProxy | null = null;

const setCanvas = (el: HTMLCanvasElement | null, n: number) => {
  if (el) canvases.set(n, el);
  else canvases.delete(n);
};

const renderPages = async () => {
  if (!pdfDoc) return;
  const doc = pdfDoc;
  const available = (stageRef.value?.clientWidth ?? BASE_WIDTH) - 32;
  const targetWidth = fit.value ? available : (BASE_WIDTH * zoom.value) / 100;
  const ratio = window.devicePixelRatio || 1;
  for (let n = 1; n <= doc.numPages; n++) {
    const canvas = canvases.get(n);
    if (!canvas) continue;
    const page = await doc.getPage(n);
    const base = page.getViewport({ scale: 1 });
    const cssScale = targetWidth / base.width;
    const viewport = page.getViewport({ scale: cssScale * ratio });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${viewport.height / ratio}px`;
    const context = canvas.getContext('2d');
    if (context) await page.render({ canvasContext: context, viewport }).promise;
  }
};

watch(pdfUrl, async (url) => {
  if (!url) return;
  const doc = await getDocument(url).promise;
  pdfDoc = doc;
  pageCount.value = doc.numPages;
  await nextTick();
  await renderPages();
});
watch([zoom, fit], () => renderPages());
const snackbar = reactive({ show: false, message: '', color: 'success' });

const LOCKED_CODES = ['accepted', 'signed', 'validated', 'invoiced'];
const isLocked = computed(
  () => Boolean(quote.value?.convertToInvoice) || LOCKED_CODES.includes(quote.value?.status?.code ?? '')
);

const statusInfo = computed(() => {
  const code = quote.value?.status?.code ?? '';
  if (code === 'invoiced') return { label: 'Facturé', color: 'success' };
  if (code === 'accepted' || quote.value?.convertToInvoice) return { label: 'Accepté', color: 'success' };
  if (code === 'refused') return { label: 'Refusé', color: 'error' };
  if (code === 'cancelled') return { label: 'Annulé', color: 'error' };
  return quote.value?.isSent
    ? { label: 'En attente', color: 'warning' }
    : { label: 'Brouillon', color: 'default' };
});

const formatDate = (d: string | Date) => new Date(d).toLocaleDateString('fr-FR');
const longDate = (d?: string | Date) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : '';
const money = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

const vehicle = computed(
  () => [quote.value?.carBrand, quote.value?.carImmatriculation].filter(Boolean).join(' · ') || '—'
);
const technician = computed(() => {
  const u = quote.value?.assignedMember?.users;
  if (!u?.first_name && !u?.last_name) return '—';
  return `${u?.first_name ?? ''}${u?.last_name ? ` ${u.last_name[0]}.` : ''}`;
});

const history = computed(() => {
  const q = quote.value;
  if (!q) return [];
  const items: { label: string; date?: string; ok?: boolean }[] = [
    { label: 'Créé', date: longDate(q.createdAt) },
  ];
  if (q.isSent) items.push({ label: 'Envoyé au client', date: longDate(q.sentAt) });
  if (q.status?.code === 'accepted' || isLocked.value)
    items.push({ label: 'Accepté', date: q.acceptedAt ? longDate(q.acceptedAt) : undefined, ok: true });
  if (q.convertToInvoice)
    items.push({ label: 'Converti en facture', date: q.convertedAt ? longDate(q.convertedAt) : undefined, ok: true });
  return items;
});

const showSnack = (message: string, color = 'success') => {
  snackbar.message = message;
  snackbar.color = color;
  snackbar.show = true;
};

const onEditBtnClick = () => router.push('/quotes/edit');
const onDownloadBtnClick = () => downloadPdf();

const onSendBtnClick = async () => {
  sending.value = true;
  try {
    await sendQuote();
    showSnack('Devis envoyé avec succès.');
  } catch (e) {
    showSnack(e instanceof Error && e.message === EMPTY_QUOTE_ERROR ? e.message : "Erreur lors de l'envoi du devis.", 'error');
  } finally {
    sending.value = false;
  }
};

onMounted(async () => {
  const quoteId = getSelectedQuoteGuid();
  if (quoteId) await init(quoteId);
});
</script>

<style scoped>
.view-quote-container {
  --q-bg: #f4f5fa;
  --q-card: #fff;
  --q-border: #e6e8f0;
  --q-border-strong: #d5d8e3;
  --q-soft: #eef0f4;
  --q-stage: #eceef5;
  --q-text: #1f2330;
  --q-muted: #4b5563;
  min-height: 100dvh;
  background: var(--q-bg);
}

.view-quote-container.is-dark {
  --q-bg: transparent;
  --q-card: rgb(var(--v-theme-surface));
  --q-border: rgba(255, 255, 255, 0.06);
  --q-border-strong: rgba(255, 255, 255, 0.2);
  --q-soft: rgba(255, 255, 255, 0.1);
  --q-stage: rgba(255, 255, 255, 0.04);
  --q-text: rgba(255, 255, 255, 0.92);
  --q-muted: rgba(255, 255, 255, 0.7);
}

.header-btn {
  border-radius: 10px;
  border: 1px solid var(--q-border-strong);
  background: var(--q-card);
  color: var(--q-text);
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
}

.header-btn:hover {
  background: var(--q-soft);
}

.header-back {
  background: var(--q-soft) !important;
  border-color: var(--q-border) !important;
  color: var(--q-muted);
}

.page-header {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 14px;
}

.lock-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  background: rgba(var(--v-theme-primary), 0.1);
  border: 1px solid rgba(var(--v-theme-primary), 0.25);
  color: rgb(var(--v-theme-primary));
}

.view-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 16px;
  align-items: start;
}

.q-card {
  background: var(--q-card);
  border: 1px solid var(--q-border);
  border-radius: 14px;
}

.viewer {
  overflow: hidden;
}

.viewer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--q-border);
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid var(--q-border-strong);
  background: var(--q-card);
  color: var(--q-text);
  cursor: pointer;
}

.zoom-btn:hover:not(:disabled),
.zoom-btn.active {
  background: var(--q-soft);
}

.zoom-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.zoom-value {
  min-width: 64px;
  padding: 6px 0;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid var(--q-border-strong);
  border-radius: 10px;
}

.viewer-stage {
  background: var(--q-stage);
  padding: 24px 16px;
  height: calc(100dvh - 300px);
  min-height: 560px;
  overflow: auto;
  display: flex;
  justify-content: center;
}

.pages {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 0 auto;
}

.pdf-page {
  flex: none;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(31, 36, 51, 0.15);
}

.side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 16px;
}

.recap-total {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
}

.mini-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 0;
  border-top: 1px solid var(--q-border);
  font-size: 13px;
}

.mini-row.no-border {
  border-top: 0;
}

@media (max-width: 960px) {
  .view-layout {
    grid-template-columns: 1fr;
  }

  .side {
    position: static;
  }
}
</style>
