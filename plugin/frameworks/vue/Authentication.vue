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
        :value="mail"
        @input="(event) => setMail(event.target.value)"
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
        :setPhone="setPhone"
        :style="style"
      />
      <Error
        v-if="error"
        :style="style.error"
        :variables="variables"
        :aria-label="Label.inputError"
      >
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
import {
  Label,
  Text,
  defaultVariables,
  defaultLabels,
  Store,
  countries,
  validateEmail,
  validatePhone,
  authenticate,
  configure,
} from 'iltio'
import Phone from './Phone.vue'
import Tabs from './Tabs.vue'
import Code from './Code.vue'
import Form from './components/Form.vue'
import Input from './components/Input.vue'
import Button from './components/Button.vue'
import Error from './components/Error.vue'

export default {
  props: {
    configuration: Object,
    allowPhone: { type: Boolean, default: true },
    allowMail: { type: Boolean, default: true },
    initialCountryCode: { type: String, default: 'us' },
    style: { type: Object, default: () => ({ phoneCountry: {}, phoneCountryOption: {} }) },
    variables: { type: Object, default: () => defaultVariables },
    labels: { type: Object, default: () => ({ ...defaultLabels }) },
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
    async handleSubmit() {
      this.error = ''
      let name

      if (this.tab === 'mail' && this.allowMail) {
        const currentMailValid = validateEmail(this.mail)
        this.mailValid = currentMailValid
        if (!currentMailValid) {
          this.error = Text.InvalidMailError
          return
        }
        name = this.mail
      }

      if (this.tab === 'phone' && this.allowPhone) {
        const removeLeadingZeros = String(Number(this.phone))
        const fullPhone = countries[this.countryCode].prefix + removeLeadingZeros
        const currentPhoneValid = validatePhone(fullPhone)
        this.phoneValid = currentPhoneValid
        if (!currentPhoneValid) {
          this.error = Text.InvalidPhoneNumberError
          return
        }
        name = fullPhone
      }

      this.loading = true

      const {
        codeToken,
        error: localError,
        registration: localRegistration,
      } = await authenticate(name)

      if (codeToken) {
        Store.codeToken = codeToken
        Store.name = name
      }

      this.loading = false

      if (localError) {
        this.error = localError === true ? Text.UnknownError : localError
        return
      }

      this.registration = localRegistration
      this.submitted = true
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
    setMail(value) {
      this.mail = value
    },
  },
  mounted() {
    if (this.configuration) {
      configure(this.configuration)
    }
  },
}
</script>
