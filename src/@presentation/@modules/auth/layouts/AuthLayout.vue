<template>
  <div class="auth-page">
    <!-- Background blobs -->
    <div class="auth-blob auth-blob-1" />
    <div class="auth-blob auth-blob-2" />

    <div class="auth-wrapper">
      <!-- Logo -->
      <div class="d-flex align-center justify-center gap-2 mb-8">
        <svg width="40" height="40" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none"/>
          <circle cx="18" cy="18" r="12" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" fill="none"/>
          <circle cx="18" cy="18" r="7" stroke="rgba(255,255,255,0.45)" stroke-width="1.5" fill="none"/>
          <circle cx="18" cy="18" r="4" fill="#F5871F"/>
        </svg>
        <span style="font-family:'Space Grotesk',sans-serif; font-size:1.25rem; font-weight:700; color:#ffffff; letter-spacing:-0.01em;">CarDentRepair</span>
      </div>

      <!-- Card -->
      <div class="auth-card">
        <div class="text-center mb-6">
          <h1 class="auth-title">Bienvenue</h1>
          <p class="auth-subtitle">Connectez-vous à votre espace</p>
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  background: rgba(43, 84, 224, 0.25);
  top: -100px;
  right: -100px;
}

.auth-blob-2 {
  width: 300px;
  height: 300px;
  background: rgba(245, 135, 31, 0.1);
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
  background: #ffffff;
  border-radius: 20px;
  padding: 36px 32px 28px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}

.auth-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #0F1626;
  margin-bottom: 6px;
}

.auth-subtitle {
  font-family: 'Manrope', sans-serif;
  font-size: 0.9rem;
  color: #9AA2B1;
  margin: 0;
}
</style>