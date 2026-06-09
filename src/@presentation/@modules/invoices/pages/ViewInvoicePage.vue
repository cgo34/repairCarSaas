<template>
  <MainLayout>
    <v-container
      fluid
      class="px-0 py-0"
    >
      <!-- Actions du facture -->
      <v-toolbar
        title=""
        color="transparent"
      >
        <template #prepend>
          <BackButton :fallback-path="`/invoices/edit/${invoice?.id}`" />
        </template>
        <template #append>
          <DownloadButton
            :url="pdfUrl"
            :filename="filename"
          />

          <GenericButton
            class="me-2 text-none"
            color="primary"
            prepend-icon="mdi-send"
            variant="flat"
            @click="onSendBtnClick"
          >
            Send
          </GenericButton>
        </template>
      </v-toolbar>
      
      <v-card
        class="rounded-lg"
        outlined
      >
        <v-card-title>
          <h3 class="text-h3">
            Prévisualisation de la facture
          </h3>
        </v-card-title>
        <v-card-subtitle>
          <h4 class="text-h5">
            ID #{{ invoice?.invoiceNumber }}
          </h4>
        </v-card-subtitle>
        <v-card-text>
          <iframe
            v-if="pdfUrl"
            :src="pdfUrl"
            width="100%"
            height="800px"
            style="border: none;"
          />
        </v-card-text>
      </v-card>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import BackButton from '@/@presentation/@ui/components/buttons/BackButton.vue';
import DownloadButton from '@/@presentation/@ui/components/buttons/DownloadButton.vue';
import GenericButton from '@/@presentation/@ui/components/buttons/GenericButton.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseViewInvoiceState } from '@/@presentation/types/composables/IUseViewInvoiceState';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const route = useRoute();


const useViewInvoiceState = container.get<IUseViewInvoiceState>(SYMBOLS.States.Invoice.ViewInvoiceState);
const { init, downloadPdf, sendInvoice, invoice, pdfUrl, filename  } = useViewInvoiceState;

const onBackBtnClick = () => {
  router.back();
};

const onDownloadBtnClick = () => {
  downloadPdf();
};

const onSendBtnClick = async () => {
  // TODO: TO DELETE (verify)
  try {
    await sendInvoice();
    alert('Facture envoyée avec succès!');
  } catch (error) {
    console.error('Error sending invoice:', error);
    alert('Erreur lors de l\'envoi de la facture');
  }
};

onMounted(async () => {
  const invoiceId = route.params.id as string;
  init(invoiceId);
});

</script>
