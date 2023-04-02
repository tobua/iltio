<template>
  <form
    :aria-label="Label.form"
    :style="{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    }"
  >
    <div
      :style="{
        display: 'flex',
        justifyContent: 'space-around',
        gap: '20px',
      }"
    >
      <template v-if="allowMail">
        <button
          type="button"
          :aria-label="Label.tabMail"
          @click="
            tab = 'mail'
            mailTabOpen = true
            phoneTabOpen = false
          "
          :style="{
            cursor: 'pointer',
            color: 'black',
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: '0px',
            fontSize: '16px',
            fontFamily: 'inherit',
          }"
        >
          Mail
        </button>
      </template>

      <template v-if="allowPhone">
        <button
          type="button"
          :aria-label="Label.tabPhone"
          @click="
            tab = 'phone'
            mailTabOpen = false
            phoneTabOpen = true
          "
          :style="{
            cursor: 'pointer',
            color: 'black',
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: '0px',
            fontSize: '16px',
            fontFamily: 'inherit',
          }"
        >
          Phone
        </button>
      </template>
    </div>

    <template v-if="mailTabOpen">
      <input
        placeholder="Mail"
        type="email"
        :aria-label="Label.inputMail"
        :aria-invalid="false"
        :value="mail"
        @input="mail = $event.target.value"
        :style="{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'black',
          padding: '9px',
          outline: 'none',
          borderRadius: '0px',
          fontSize: '16px',
          fontFamily: 'inherit',
          backgroundColor: 'inherit',
        }"
      />
    </template>

    <template v-if="phoneTabOpen">
      <input
        placeholder="Phone"
        type="tel"
        :aria-label="Label.inputPhone"
        :aria-invalid="false"
        :value="phone"
        @input="phone = $event.target.value"
        :style="{
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'black',
          padding: '9px',
          outline: 'none',
          borderRadius: '0px',
          fontSize: '16px',
          fontFamily: 'inherit',
          backgroundColor: 'inherit',
        }"
      />
    </template>

    <button
      type="submit"
      :aria-label="Label.submit"
      :style="{
        backgroundColor: 'black',
        border: 'none',
        color: 'white',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '0px',
        fontSize: '16px',
        fontFamily: 'inherit',
      }"
    >
      Submit
    </button>
  </form>
</template>

<script>
import { Label } from 'iltio'

export default {
  name: 'authentication',

  props: ['allowMail', 'allowPhone', 'initialCountryCode', 'props'],

  data() {
    return {
      tab: this.allowMail ? 'mail' : 'phone',
      mailTabOpen: this.allowMail ?? true,
      phoneTabOpen: !(this.allowMail ?? true) && (this.allowPhone ?? true),
      mail: '',
      phone: '',
      countryCode: this.initialCountryCode || 'ch',
      mailValid: true,
      phoneValid: true,
      loading: false,
      registration: false,
      error: '',
      codeValid: true,
      phoneTabClass: 'active',
      mailTabClass: '',
      Label,
    }
  },

  created() {
    console.log('vue created')
  },
  mounted() {
    console.log('vue mounted')
  },
}
</script>
