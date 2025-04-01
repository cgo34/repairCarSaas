<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="quotes"
          :sort-by="[{ key: 'quoteNumber', order: 'asc' }]"
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
              @click="onDeleteQuote(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <!-- #ENDREGION -->
        </v-data-table>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
// import { container } from '@/@infrastructure/ioc/inversify.config';
// import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseQuotesState } from '@/@presentation/types/composables/IUseQuotesState';
import { onMounted } from 'vue';
// import { IUseQuoteState } from '@/@presentation/types/composables/IUseQuoteState';
// import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Injection du state depuis Inversify
const useQuoteState = container.get<IUseQuotesState>(SYMBOLS.States.Quote.GetQuotesUseCase);
const { init, quotes } = useQuoteState;

const router = useRouter();

const headers = [
  { title: 'Numéro de devis', align: 'start', key: 'quoteNumber' },
  { title: 'Statut', align: 'start', key: 'status' },
  { title: 'Date', align: 'start', key: 'startDate' },
  { title: 'Technicien', key: 'technicianId' },
  { title: 'Garage', key: 'garageId' },
  { title: 'Forfait', key: 'isForfait' },
  { title: 'Total (€)', key: 'total' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

// const quotes = [
//   {
//     id: 1,
//     quoteNumber: 'DEV-2021-0001',
//     date: '2021-01-01',
//     technician: { name: 'John Doe' },
//     garage: { name: 'Garage 1' },
//     total: 1000
//   },
//   {
//     id: 2,
//     quoteNumber: 'DEV-2021-0002',
//     date: '2021-01-02',
//     technician: { name: 'Jane Doe' },
//     garage: { name: 'Garage 2' },
//     total: 2000
//   }
// ];

const onAddQuote = () => {
  router.push('/quotes/new');
};

const onEditQuote = (item) => {
  router.push(`/quotes/edit/${item.id}`);
};

const onDeleteQuote = async (item) => {
  if (!item.id) return;

  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer le devis numéro "${item.quoteNumber}" ?`);
  if (!confirmed) return;

  // await deleteQuote(item.id);
};

onMounted(async () => {
  await init();
});
</script>
