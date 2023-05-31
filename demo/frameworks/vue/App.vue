<script setup lang="ts">
import Authentication from 'iltio/vue'
</script>

<template>
  <main :style="{ fontFamily: 'sans-serif' }">
    <h1>iltio Vue Demo</h1>
    <div
      :style="{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '40px',
        justifyContent: 'center',
      }"
    >
      <div id="base" :style="{ display: 'flex', justifyContent: 'center' }">
        <Authentication
          :configuration="{ token: 'demo' }"
          :on-success="
            (name, token, registration) => console.log('success', name, token, registration)
          "
        />
      </div>
      <div id="phone" :style="{ display: 'flex', justifyContent: 'center' }">
        <Authentication :allowMail="false" />
      </div>
      <div
        id="properties"
        :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center' }"
      >
        <Authentication
          :variables="{
            color: 'blue',
            borderRadius: 10,
          }"
          :style="{
            form: {
              width: '130px',
            },
          }"
        />
      </div>
    </div>
  </main>
</template>
