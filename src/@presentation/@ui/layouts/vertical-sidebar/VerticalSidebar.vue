<script setup lang="ts">
import { IAuthState } from '@/@application/states/interfaces/IAuthState';
import { container } from '@/@infrastructure/ioc/inversify.config';
import { SYMBOLS } from '@/@infrastructure/ioc/symbols';
import { useCustomizerState } from '@/@presentation/composables/useCustomizerState';
import { computed } from 'vue';
import ExtraBox from './extrabox/ExtraBox.vue';
import UpgradePlanCard from './extrabox/UpgradePlanCard.vue';
import { menu } from './menu/adminMenu';
import NavCollapse from './NavCollapse/NavCollapse.vue';
import NavGroup from './NavGroup/NavGroup.vue';
import NavItem from './NavItem/NavItem.vue';
// import sidebarItems from './sidebarItem';
// import Logo from '@presentation/@ui/layouts/logo/LogoMain.vue';
import Logo from '../logo/LogoMain.vue';
import { filterMenuByRole } from '@/@presentation/helpers/menu/filterMenuByRole';


const authState = container.get<IAuthState>(SYMBOLS.States.AuthState);
const { userContext, subscription } = authState
console.log('User Context:', userContext.value.subscription);

const {
    setMiniSidebar,
    sidebarDrawer,
    miniSidebar
  } = useCustomizerState();

// Assume we have a function to get the current user's role
const userRole = 'admin'; // This should be dynamically determined

const sidebarMenu = computed(() => {

  const role =
    userContext
      .value
      ?.membership
      .role ?? '';

  return filterMenuByRole(
    menu,
    role
  );
});
</script>

<template>
  <v-btn
    class="hidden-md-and-down text-secondary"
    color="lightsecondary"
    icon
    rounded="sm"
    variant="flat"
    size="small"
    @click.stop="setMiniSidebar(!miniSidebar)"
  >
    <Menu2Icon
      size="20"
      stroke-width="1.5"
    />
  </v-btn>
  <v-navigation-drawer
    v-model="sidebarDrawer"
    left
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="miniSidebar"
    expand-on-hover
  >
    <!---Logo part -->

    <div class="px-5 py-2">
      <Logo />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-4">
        <!---Menu Loop -->
        <template
          v-for="(item, i) in sidebarMenu"
          :key="i"
        >
          <!---Item Sub Header -->
          <NavGroup
            v-if="item.header"
            :key="item.title"
            :item="item"
          />
          <!---Item Divider -->
          <v-divider
            v-else-if="item.divider"
            class="my-3"
          />
          <!---If Has Child -->
          <NavCollapse
            v-else-if="item.children"
            class="leftPadding"
            :item="item"
            :level="0"
          />
          <!---Single Item-->
          <NavItem
            v-else
            :item="item"
            class="leftPadding"
          />
          <!---End Single Item-->
        </template>
      </v-list>
      <div
        v-if="userContext?.subscription?.plan === 'free'"
        class="pa-4"
      >
        <UpgradePlanCard />
      </div>
      <div class="pa-4 text-center">
        <v-chip
          color="inputBorder"
          size="small"
        >
          v1.0.0
        </v-chip>
      </div>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>
