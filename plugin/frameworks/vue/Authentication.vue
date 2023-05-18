<template>
  <Form
    :aria-label="Label.form"
    @submit.prevent="handleSubmit"
    :style="style.form"
    :variables="variables"
  >
    <template v-if="!submitted">
      <Tabs
        :multipleInputs="multipleInputs"
        :tab="tab"
        :setTab="setTab"
        :style="style"
        :variables="variables"
        :labels="labels"
      />
      <Input
        v-if="allowMail && (!multipleInputs || tab === 'mail')"
        :aria-label="Label.inputMail"
        :aria-invalid="!mailValid"
        v-model="mail"
        required
        :valid="mailValid"
        :variables="variables"
        :style="style.inputMail"
        :placeholder="Text.MailInputPlaceholder"
        type="email"
      />
      <Phone
        v-if="allowPhone && (!multipleInputs || tab === 'phone')"
        :variables="variables"
        :phoneValid="phoneValid"
        :countryCode="countryCode"
        :setCountryCode="setCountryCode"
        :phone="phone"
        @setPhone="setPhone"
        :style="style"
      />
      <Error v-if="error" :style="style.error" :variables="variables">
        {{ error }}
      </Error>
      <Button :aria-label="Label.submit" type="submit" :style="style.button" :variables="variables">
        {{ loading ? Text.LoadingButton : labels.submit }}
      </Button>
    </template>
    <template v-else>
      <Code
        :style="style"
        :variables="variables"
        :labels="labels"
        :registration="registration"
        :codeValid="codeValid"
        :handleCode="handleCode"
      />
    </template>
  </Form>
</template>

<script>
import { Label, Text, defaultVariables, defaultLabels, Store } from 'iltio'
import Phone from './Phone.vue'
import Tabs from './Tabs.vue'
import Code from './Code.vue'
import Form from './components/Form.vue'
import Input from './components/Input.vue'
import Button from './components/Button.vue'
import Error from './components/Error.vue'

export default {
  props: {
    allowPhone: { type: Boolean, default: true },
    allowMail: { type: Boolean, default: true },
    initialCountryCode: { type: String, default: 'us' },
    style: { type: Object, default: () => ({ phoneCountry: {}, phoneCountryOption: {} }) },
    variables: { type: Object, default: () => defaultVariables },
    labels: { type: Object, default: () => ({}) },
    Components: {
      type: Object,
      default: () => ({}),
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
      Text,
      labels: { ...defaultLabels },
      Label,
    }
  },
  components: {
    Tabs,
    Code,
    Phone,
    Form,
    Input,
    Button,
    Error,
  },
  methods: {
    handleSubmit() {
      this.loading = true
      this.error = ''

      setTimeout(() => {
        const success = Math.random() > 0.5

        this.loading = false
        this.mailValid = success
        this.phoneValid = success
        this.registration = success
        this.submitted = success

        if (!success) {
          this.error = 'Please enter a valid mail address or phone number.'
        }
      }, 2000)
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
    // TODO check verified.
  },
}
</script>
