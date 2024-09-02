<template>
  <button type="submit" class="btn btn-primary">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped>
.btn-primary {
  color: #000; /* Setze die Schriftfarbe */
  border: none; /* Entferne den Standardrahmen */
  border-radius: 50px; /* Runde die Ecken */
  padding: 10px 30px; /* Passe den Innenabstand an */
  font-family: 'Rubik', sans-serif; /* Verwende die Rubik-Schriftart */
  font-size: 16px; /* Schriftgröße */
  text-align: center; /* Zentriere den Text */
  transition: background-color 0.3s ease; /* Füge eine Übergangsanimation hinzu */
  width: 100%; /* Setze die Breite auf 100% */
}

.btn-primary:hover {
  background-color: #00b3a3; /* Dunklere Hintergrundfarbe bei Hover */
}
</style>
