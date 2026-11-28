<template>
  <div class="subscription-overlay">
    <div class="overlay-content">
      <p>{{ t('subscription.page.overlay.message') }}</p>
      <button @click="redirectToUpgrade">
        {{ t('subscription.page.overlay.upgrade') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const redirectToUpgrade = () => {
  console.log('redirectToUpgrade')
  // Redirige vers la page de mise à niveau de la souscription
  // router.push('/upgrade');
}
</script>

<style scoped>
.subscription-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0 0 0 / 50%); /* Calque semi-transparent */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Assure que le calque est au-dessus de tout */
}

.overlay-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}
</style>
