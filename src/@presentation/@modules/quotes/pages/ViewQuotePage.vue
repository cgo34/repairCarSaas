<template>
  <MainLayout>
    <v-container
      fluid
      class="px-0 py-0"
    >
      <!-- Actions du devis -->
      <v-toolbar
        title=""
        color="transparent"
      >
        <template #prepend>
          <BackButton />
        </template>
        <template #append>
          <DownloadButton
            :url="pdfUrl"
            :filename="filename"
          />

          <GenericButton
            v-if="!isFreePlan"
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
            Prévisualisation du devis
          </h3>
        </v-card-title>
        <v-card-subtitle>
          <h4 class="text-h5">
            ID #{{ quote?.quoteNumber }}
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
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import BackButton from '@/@presentation/@ui/components/buttons/BackButton.vue';
import DownloadButton from '@/@presentation/@ui/components/buttons/DownloadButton.vue';
import GenericButton from '@/@presentation/@ui/components/buttons/GenericButton.vue';
import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IUseViewQuoteState } from '@/@presentation/types/composables/IUseViewQuoteState';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const router = useRouter();
const route = useRoute();


const useViewQuoteState = container.get<IUseViewQuoteState>(SYMBOLS.States.Quote.ViewQuoteState);
const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { isFreePlan } = authState
const { init, downloadPdf, sendQuote, quote, pdfUrl, filename  } = useViewQuoteState;

const onSendBtnClick = () => {
  console.log('onSendBtnClick');
  // router.push(`/quotes/send/${route.params.id}`);
  sendQuote();
};

onMounted(async () => {
  const quoteId = route.params.id as string;
  init(quoteId);
});

</script>
