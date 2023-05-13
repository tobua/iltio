<template>
  <Components.Form
    :aria-label="labels.form"
    @submit.prevent="handleSubmit"
    :style="style.form"
    :variables="variables"
  >
    <template v-if="!submitted">
      <Tabs
        :multipleInputs="multipleInputs"
        :tab="tab"
        :Components="Components"
        @setTab="setTab"
        :style="style"
        :variables="variables"
        :labels="labels"
      />
      <Components.Input
        v-if="allowMail && (!multipleInputs || tab === 'mail')"
        :aria-label="labels.inputMail"
        :aria-invalid="!mailValid"
        v-model="mail"
        required
        :valid="mailValid"
        :variables="variables"
        :style="style.inputMail"
        placeholder="Text.MailInputPlaceholder"
        type="email"
      />
      <Phone
        v-if="allowPhone && (!multipleInputs || tab === 'phone')"
        :variables="variables"
        :phoneValid="phoneValid"
        :countryCode="countryCode"
        @setCountryCode="setCountryCode"
        :phone="phone"
        @setPhone="setPhone"
        :Components="Components"
        :style="style"
      />
      <Components.Error v-if="error" :style="style.error" :variables="variables">
        {{ error }}
      </Components.Error>
      <Components.Button
        :aria-label="labels.submit"
        @click="handleSubmit"
        type="submit"
        :style="style.button"
        :variables="variables"
      >
        {{ loading ? Text.LoadingButton : labels.submit }}
      </Components.Button>
    </template>
    <template v-else>
      <Code
        :Components="Components"
        :style="style"
        :variables="variables"
        :labels="labels"
        :registration="registration"
        :codeValid="codeValid"
        @handleCode="handleCode"
      />
    </template>
  </Components.Form>
</template>

<script>
import { Label, Text, defaultVariables, defaultLabels, Store } from 'iltio'
import Phone from './Phone.vue'
import Tabs from './Tabs.vue'
import Code from './Code.vue'
import Form from './components/Form.vue'

export default {
  props: {
    allowPhone: { type: Boolean, default: true },
    allowMail: { type: Boolean, default: true },
    initialCountryCode: { type: String, default: 'us' },
    style: { type: Object, default: () => ({}) },
    variables: { type: Object, default: () => defaultVariables },
    labels: { type: Object, default: () => ({}) },
    Components: {
      type: Object,
      default: () => ({
        Form,
        TabWrapper: Form,
        Tab: Form,
        Input: Form,
        Button: Form,
        Message: Form,
        Error: Form,
        PhoneCountry: Form,
        PhoneCountryOptions: Form,
        PhoneCountryOption: Form,
        PhoneInput: Form,
        PhoneTop: Form,
        PhoneWrapper: Form,
      }),
    },
  },
  data() {
    return {
      tab: this.allowMail ? 'mail' : 'phone',
      mail: '',
      phone: '',
      countryCode: this.initialCountryCode.toLowerCase(),
      mailValid: true,
      phoneValid: true,
      multipleInputs: this.allowMail && this.allowPhone,
      loading: false,
      submitted: Store.codeToken !== '',
      registration: false,
      error: '',
      codeValid: true,
    }
  },
  watch: {
    Components: {
      handler() {
        this.Components = { ...components, ...this.Components }
      },
      deep: true,
    },
    variables: {
      handler() {
        this.variables = { ...defaultVariables, ...this.variables }
      },
      deep: true,
    },
    labels: {
      handler() {
        this.labels = { ...defaultLabels, ...this.labels }
      },
      deep: true,
    },
  },
  methods: {
    handleSubmit() {
      console.log('submit')
    },
    handleCode(code) {
      console.log(code)
    },
    setTab(value) {
      this.tab = value
    },
    setCountryCode(value) {
      this.countryCode = value
    },
    setPhone(value) {
      this.phone = value
    },
  },
  mounted() {
    console.log('effect')
  },
}
</script>
