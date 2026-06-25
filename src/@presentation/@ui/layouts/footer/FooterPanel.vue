<script setup lang="ts">
import { shallowRef } from 'vue';

const footerLink = shallowRef([
  {
    title: 'Home',
    url: '/dashboard'
  },
  {
    title: 'Documentation',
    url: '#'
  },
  {
    title: 'Support',
    url: '#'
  }
]);
</script>
<template>
  <div class="footer-bar">
    <span class="text-caption text-medium-emphasis">
      Car Dent Repair ♥ Made with love by
      <a href="#" class="text-darkText text-decoration-none" target="_blank">CGOnlin & Binardzone</a>
    </span>
    <div class="footer-links">
      <a
        v-for="(item, i) in footerLink"
        :key="i"
        class="text-caption text-darkText text-decoration-none"
        :href="item.url"
      >
        {{ item.title }}
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);

  .footer-links {
    display: flex;
    gap: 16px;
  }

  a:hover {
    color: rgb(var(--v-theme-primary)) !important;
  }
}
</style>