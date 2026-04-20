<script setup lang="ts">
import { ref } from 'vue';
import { LogoutIcon, SettingsIcon, UserIcon } from 'vue-tabler-icons';
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';

const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { user } = authState;
console.log('User from authState:', user);

const swt1 = ref(true);
const swt2 = ref(false);
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!-- profile DD -->
  <!-- ---------------------------------------------- -->
  <div class="pa-4">
    <h4 class="mb-n1">
      Good Morning, <span class="font-weight-regular">{{ user?.fullName }}</span>
    </h4>
    <span class="text-subtitle-2 text-medium-emphasis">{{ user?.role }}</span>

    <v-text-field
      persistent-placeholder
      placeholder="Search"
      class="my-3"
      color="primary"
      variant="outlined"
      hide-details
    >
      <template #prepend-inner>
        <SearchIcon
          stroke-width="1.5"
          size="20"
          class="text-lightText SearchIcon"
        />
      </template>
    </v-text-field>

    <v-divider />
    <perfect-scrollbar style="height: calc(100vh - 300px); max-height: 515px">
      <div
        class="bg-lightwarning rounded-md pa-5 my-3 circle sm-circle lg-circle"
      >
        <h4>Upgrade your plan</h4>
        <h6 class="text-subtitle-2 text-medium-emphasis mr-11 pr-11 mb-3 mt-2">
          70% discount for 1 years subscriptions.
        </h6>
        <v-btn
          color="warning"
          variant="flat"
          target="_"
          href="https://codedthemes.com/item/berry-vue-admin-dashboard/"
        >
          Go Premium
        </v-btn>
      </div>

      <v-divider />

      <div class="bg-lightprimary rounded-md px-5 py-3 my-3">
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">
            Start DND Mode
          </h5>
          <div>
            <v-switch
              v-model="swt1"
              color="primary"
              hide-details
            />
          </div>
        </div>
        <div class="d-flex align-center justify-space-between">
          <h5 class="text-h5">
            Allow Notifications
          </h5>
          <div>
            <v-switch
              v-model="swt2"
              color="primary"
              hide-details
            />
          </div>
        </div>
      </div>

      <v-divider />

      <v-list class="mt-3">
        <v-list-item
          color="secondary"
          rounded="md"
        >
          <template #prepend>
            <SettingsIcon
              size="20"
              class="mr-2"
            />
          </template>

          <v-list-item-title class="text-subtitle-2">
            Account Settings
          </v-list-item-title>
        </v-list-item>

        <v-list-item
          color="secondary"
          rounded="md"
        >
          <template #prepend>
            <UserIcon
              size="20"
              class="mr-2"
            />
          </template>

          <v-list-item-title class="text-subtitle-2">
            Social Profile
          </v-list-item-title>

          <template #append>
            <v-chip
              color="warning"
              class="text-white"
              text="02"
              variant="flat"
              size="small"
            />
          </template>
        </v-list-item>

        <v-list-item
          color="secondary"
          rounded="md"
          to="/logout"
        >
          <template #prepend>
            <LogoutIcon
              size="20"
              class="mr-2"
            />
          </template>

          <v-list-item-title class="text-subtitle-2">
            Logout
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </perfect-scrollbar>
  </div>
</template>
