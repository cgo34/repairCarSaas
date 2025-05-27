<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="quotes"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Gestion des Devis</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer />
              <v-btn
                class="mb-2"
                color="primary"
                @click="onAddQuote"
              >
                Ajouter un Devis
              </v-btn>
            </v-toolbar>
          </template>
          <!-- #ENDREGION -->

          <template #item.quoteNumber="{ value }">
            <span class="font-weight-medium">#{{ value }}</span>
          </template>
          
          <template #item.garage="{ value }">
            {{ value.name }}
          </template>
          
          <template #item.createdAt="{ value }">
            {{  regionManager.formatDate(value) }}
          </template>

          <template #item.status="{ value }">
            <v-chip :text="value.label" :color="value.code === 'processing' ? 'blue' : value.code === 'accepted' ? 'green' : 'red'"></v-chip>
          </template>

          
          <template #item.isForfait="{ value }">
              <v-icon :color="value ? 'green' : 'red'"
              >
                {{  value ? 'mdi-checkbox-marked-circle' : 'mdi-close-circle' }}
              </v-icon>
          </template>

          <!-- #REGION -> BODY : TOTAL -->
          <template #item.total="{ item }">
            {{ item.isForfait ? `${ item.forfaitAmount } €` : `${ item.total ?? 0 } €` }}
          </template>


          <!-- #REGION -> ITEM ACTIONS -->
          <template #item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="onEditQuote(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              size="small"
              @click="onDeleteBtnClick(item.id)"
            >
              mdi-delete
            </v-icon>
          </template>
          <!-- #ENDREGION -->
        </v-data-table>
      </v-row>
    </v-container>
  </MainLayout>

  <ConfirmDialog
    ref="deleteQuoteConfirmDialogRef"
    title="Delete quote"
    message="You will delete this quote, are you sure ?"
    confirmLabel="Confirmer"
    cancelLabel="Annuler"
    type="warning"
    @confirm="onConfirmDeleteQuote"
  >
  </ConfirmDialog>
</template>

<script setup lang="ts">
import { IRegionManager } from '@/@core/managers/interfaces/IRegionManager';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { ConfirmDialogExposed } from '@/@presentation/components/ConfirmDialog';
import ConfirmDialog from '@/@presentation/components/ConfirmDialog.vue';
import { IUseQuotesState } from '@/@presentation/types/composables/IUseQuotesState';
import { QuoteViewModel } from '@/@presentation/types/models/QuoteViewModel';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const useQuoteState = container.get<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase);
const { init, quotes, deleteQuote } = useQuoteState;

const router = useRouter();

const headers = [
  { title: 'Numéro de devis', align: 'start', key: 'quoteNumber' },
  { title: 'Date', align: 'start', key: 'createdAt' },
  { title: 'Statut', align: 'start', key: 'status' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician.fullName' },
  { title: 'Forfait', key: 'isForfait' },
  { title: 'Total', key: 'total' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const deleteQuoteConfirmDialogRef = ref<ConfirmDialogExposed>()
const _quoteToDelete = ref<string | undefined>(undefined)

const onAddQuote = () => {
  router.push('/quotes/new');
};

const onEditQuote = (item: QuoteViewModel) => {
  router.push(`/quotes/edit/${item.id}`);
};

const onDeleteBtnClick = (id: string | undefined) => {
  if (!id)
    return

  _quoteToDelete.value = id
  deleteQuoteConfirmDialogRef.value?.open()
};

const onConfirmDeleteQuote = () => {
  if (!_quoteToDelete.value)
    return

  deleteQuote(_quoteToDelete.value)
}

onMounted(async () => {
  await init();
});
</script>
