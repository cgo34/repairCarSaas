<template>
  <div class="subscription-overlay">
    <div class="overlay-content">
      <p>Cette fonctionnalité est réservée aux utilisateurs avec une souscription payante.</p>
      <button @click="redirectToUpgrade">Mettre à niveau</button>
    </div>
  </div>
</template>

<script setup lang="ts">

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
  background-color: rgba(0, 0, 0, 0.5); /* Calque semi-transparent */
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
