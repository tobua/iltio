<script setup lang="ts">
import Authentication from 'iltio/vue'
import MyPhoneWrapper from './components/MyPhoneWrapper.vue'
import MyInput from './components/MyInput.vue'
import MyButton from './components/MyButton.vue'
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
      <div id="custom">
        <Authentication
          :style="{
            form: { width: '300px', border: '1px dashed hsl(0, 0%, 78.0%)', padding: '20px' },
            tabWrapper: {
              backgroundColor: 'hsl(0, 0%, 80%)',
              borderRadius: '10px',
              padding: '10px',
            },
          }"
          :variables="{ color: 'hsl(0, 0%, 43.5%)' }"
          :Components="{
            Button: MyButton,
            Input: MyInput,
            PhoneWrapper: MyPhoneWrapper,
          }"
        />
      </div>
      <div
        id="styles"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'green',
          fontSize: '14px',
          fontFamily: 'monospace',
          backgroundColor: 'lightgray',
          padding: '10px',
        }"
      >
        <Authentication
          :variables="{ fontSize: 'inherit', color: 'inherit', contrast: 'red' }"
          :labels="{ submit: 'Inherited Background??', tabMail: 'E-Mail' }"
        />
      </div>
    </div>
  </main>
</template>
