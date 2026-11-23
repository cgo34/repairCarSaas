<script setup lang="ts">
import { CarIcon } from 'vue-tabler-icons';
</script>

<template>
  <v-card
    rounded="xl"
    border
    elevation="0"
    class="pa-4"
  >
    <!-- TOP -->
    <div class="d-flex align-start ga-4 mb-5">
      <!-- ICON -->
      <div
        class="d-flex align-center justify-center rounded-lg bg-lightprimary text-primary"
        style="width: 56px; height: 56px;"
      >
        <CarIcon
          size="30"
          stroke-width="1.5"
        />
      </div>

      <!-- CONTENT -->
      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-bold mb-1">
          Besoin de plus ?
        </div>

        <div class="text-body-2 text-medium-emphasis">
          Passez à une offre supérieure pour développer votre activité
          et ajouter plus d'utilisateurs.
        </div>
      </div>
    </div>

    <!-- BUTTON -->
    <v-btn
      color="primary"
      variant="flat"
      rounded="lg"
      block
      height="44"
      class="text-none font-weight-semibold"
      to="/subscription/overview"
    >
      Voir les offres
    </v-btn>
  </v-card>
</template>