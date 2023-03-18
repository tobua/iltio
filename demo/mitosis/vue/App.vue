<script setup lang="ts">
import Authentication from 'iltio/vue'
</script>

<template>
  <main :style="{ fontFamily: 'sans-serif' }">
    <h1>iltio Vue Demo</h1>
    <Authentication token="123" allowMail="true" allowPhone="true" />
  </main>
</template>
