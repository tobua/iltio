<script setup lang="ts">
import Authentication from 'iltio/vue'
</script>

<template>
  <main :style="{ fontFamily: 'sans-serif' }">
    <h1>iltio Vue Demo</h1>
    <div id="base" :style="{ display: 'flex', justifyContent: 'center' }">
      <Authentication token="123" />
    </div>
  </main>
</template>
