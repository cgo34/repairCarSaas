<template>
    <MainLayout>
      <v-container>
        <v-row>
          <!-- -------------------------------------------------------------------- -->
          <!-- Total Earning -->
          <!-- -------------------------------------------------------------------- -->
          <v-col cols="12" md="4">
            <TotalEarning />
          </v-col>
          <!-- -------------------------------------------------------------------- -->
          <!-- Total Order -->
          <!-- -------------------------------------------------------------------- -->
          <v-col cols="12" md="4">
            <TotalOrder />
          </v-col>
          <!-- -------------------------------------------------------------------- -->
          <!-- Total Income -->
          <!-- -------------------------------------------------------------------- -->
          <v-col cols="12" md="4">
            <TotalIncome />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title>Test</v-card-title>
              <v-card-text>100,000 €</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title>Total Clients</v-card-title>
              <v-card-text>500+</v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title>Total Revenue</v-card-title>
              <v-card-text>100,000 €</v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card>
              <v-card-title>Total Clients</v-card-title>
              <v-card-text>500+</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </MainLayout>
  </template>
  
  <script setup lang="ts">
  // imported components
  import TotalEarning from '@/@presentation/@ui/components/TotalEarning.vue';
import TotalIncome from '@/@presentation/@ui/components/TotalIncome.vue';
import TotalOrder from '@/@presentation/@ui/components/TotalOrder.vue';
  // import TotalOrder from './components/TotalOrder.vue';
  // import TotalIncome from './components/TotalIncome.vue';
  // import TotalGrowth from './components/TotalGrowth.vue';
  // import PopularStocks from './components/PopularStocks.vue';

  import MainLayout from '@/@presentation/@ui/layouts/MainLayout.vue';
import { IAuthState } from '@domain/states/IAuthState';
import { container } from '@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@infrastructure/ioc/symbols';

  const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);

  </script>
  