<template>
  <MainLayout>
    <v-container fluid>
      <v-row>
        <v-data-table
          :headers="headers"
          :items="invoices"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
        >
          <!-- #REGION -> TOP BAR -->
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title>Gestion des factures</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              />
              <v-spacer />
              <v-btn
                class="mb-2"
                color="primary"
                @click="onAddInvoice"
              >
                Ajouter une facture
              </v-btn>
            </v-toolbar>
          </template>
          <!-- #ENDREGION -->

          
          <template #item.invoiceNumber="{ value }">
            <span class="font-weight-medium">#{{ value }}</span>
          </template>
          
          <template #item.createdAt="{ value }">
            {{  regionManager.formatDate(value) }}
          </template>
          
          <template #item.garage="{ value }">
            {{ value.name }}
          </template>

          <template #item.status="{ value }">
            <v-chip :text="statusLabel(value)" :color="statusColor(value)"></v-chip>
          </template>

          

          <!-- #REGION -> BODY : TOTAL -->
          <template #item.total="{ item }">
            {{ item.totalHt ? `${ item.totalHt } €` : (item.isForfait ? `${ item.forfaitAmount ?? 0 } €` : '0 €') }}
          </template>


          <!-- #REGION -> ITEM ACTIONS -->
          <template #item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="onEditInvoice(item)"
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
    ref="deleteInvoiceConfirmDialogRef"
    title="Delete invoice"
    message="You will delete this invoice, are you sure ?"
    confirmLabel="Confirmer"
    cancelLabel="Annuler"
    type="warning"
    @confirm="onConfirmDeleteInvoice"
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
import { IUseInvoicesState } from '@/@presentation/types/composables/IUseInvoicesState';
import { InvoiceViewModel } from '@/@presentation/types/models/InvoiceViewModel';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const regionManager = container.get<IRegionManager>(SYMBOLS.Managers.regionManager);
const useInvoiceState = container.get<IUseInvoicesState>(SYMBOLS.States.Invoice.GetInvoicesUseCase);
const { init, invoices, deleteInvoice } = useInvoiceState;

const router = useRouter();

const headers = [
  { title: 'Numéro de facture', align: 'start', key: 'invoiceNumber' },
  { title: 'Date', align: 'start', key: 'createdAt' },
  { title: 'Statut', align: 'start', key: 'status' },
  { title: 'Modèle', key: 'carBrand' },
  { title: 'Garage', key: 'garage.name' },
  { title: 'Technicien', key: 'technician.fullName' },
  { title: 'Total', key: 'total' },
  { title: 'Actions', sortable: false, key: 'actions' }
] as const;

const deleteInvoiceConfirmDialogRef = ref<ConfirmDialogExposed>()
const _invoiceToDelete = ref<string | undefined>(undefined)

const onAddInvoice = () => {
  router.push('/invoices/new');
};

const onEditInvoice = (item: InvoiceViewModel) => {
  router.push(`/invoices/edit/${item.id}`);
};

const onDeleteBtnClick = (id: string | undefined) => {
  if (!id)
    return

  _invoiceToDelete.value = id
  deleteInvoiceConfirmDialogRef.value?.open()
};

const onConfirmDeleteInvoice = () => {
  if (!_invoiceToDelete.value)
    return

  deleteInvoice(_invoiceToDelete.value)
}

const statusColor = (status?: string) => ({
  pending: 'orange',
  validated: 'success',
  accepted: 'success',
  signed: 'success',
  sent: 'blue',
  draft: 'grey',
  cancel: 'error',
} as Record<string, string>)[status ?? ''] ?? 'default';

const statusLabel = (status?: string) => ({
  pending: 'En attente',
  validated: 'Payé',
  accepted: 'Accepté',
  signed: 'Signé',
  sent: 'Envoyé',
  draft: 'Brouillon',
  cancel: 'Annulé',
} as Record<string, string>)[status ?? ''] ?? (status ?? '');

onMounted(async () => {
  await init();
});
</script>
