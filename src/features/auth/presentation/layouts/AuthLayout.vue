<template>
  <div class="auth-page">
    <!-- Background blobs -->
    <div class="auth-blob auth-blob-1" />
    <div class="auth-blob auth-blob-2" />

    <div class="auth-wrapper">
      <!-- Logo -->
      <div class="d-flex align-center justify-center mb-8">
        <img
          :src="logoUrl"
          alt="CarDentRepair"
          class="auth-logo"
        >
      </div>

      <!-- Card -->
      <div class="auth-card">
        <div class="text-center mb-6">
          <h1 class="auth-title">
            {{ title }}
          </h1>
          <p class="auth-subtitle">
            {{ subtitle }}
          </p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoUrl from '@/assets/images/logos/logo_car-dent-repair.png'

withDefaults(defineProps<{ title?: string; subtitle?: string }>(), {
  title: 'Bienvenue',
  subtitle: 'Connectez-vous à votre espace',
})
</script>

<style scoped>
.auth-logo {
  width: 260px;
  max-width: 100%;
  height: auto;
}

.auth-page {
  min-height: 100dvh;
  background: #0F1626;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px;
}

.auth-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}

.auth-blob-1 {
  width: 400px;
  height: 400px;
  background: rgb(43 84 224 / 25%);
  top: -100px;
  right: -100px;
}

.auth-blob-2 {
  width: 300px;
  height: 300px;
  background: rgb(245 135 31 / 10%);
  bottom: -80px;
  left: -80px;
}

.auth-wrapper {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: #fff;
  border-radius: 20px;
  padding: 36px 32px 28px;
  box-shadow: 0 24px 64px rgb(0 0 0 / 40%);
}

.auth-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #0F1626;
  margin-bottom: 6px;
}

.auth-subtitle {
  font-family: Manrope, sans-serif;
  font-size: 0.9rem;
  color: #9AA2B1;
  margin: 0;
}
</style>