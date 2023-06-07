<template>
  <component
    :is="Form"
    :aria-label="Label.form"
    @submit.prevent="handleSubmit"
    :style="mergedStyle.form"
    :variables="mergedVariables"
  >
    <template v-if="!submitted">
      <Tabs
        :multipleInputs="multipleInputs"
        :tab="tab"
        :setTab="setTab"
        :style="mergedStyle"
        :variables="mergedVariables"
        :labels="mergedLabels"
        :Tab="Tab"
        :TabWrapper="TabWrapper"
      />
      <component
        :is="Input"
        v-if="allowMail && (!multipleInputs || tab === 'mail')"
        :aria-label="Label.inputMail"
        :aria-invalid="!mailValid"
        :value="mail"
        @input="(event) => setMail(event.target.value)"
        required
        :valid="mailValid"
        :variables="mergedVariables"
        :style="mergedStyle.inputMail"
        :placeholder="Text.MailInputPlaceholder"
        type="email"
      />
      <Phone
        v-if="allowPhone && (!multipleInputs || tab === 'phone')"
        :variables="mergedVariables"
        :phoneValid="phoneValid"
        :countryCode="countryCode"
        :setCountryCode="setCountryCode"
        :phone="phone"
        :setPhone="setPhone"
        :style="mergedStyle"
        :Input="Input"
        :PhoneWrapper="PhoneWrapper"
        :PhoneTop="PhoneTop"
        :PhoneInput="PhoneInput"
        :PhoneCountryOptions="PhoneCountryOptions"
        :PhoneCountryOption="PhoneCountryOption"
        :PhoneCountry="PhoneCountry"
      />
      <component
        :is="Error"
        v-if="error"
        :style="mergedStyle.error"
        :variables="mergedVariables"
        :aria-label="Label.inputError"
      >
        {{ error }}
      </component>
      <component
        :is="Button"
        :aria-label="Label.submit"
        type="submit"
        :style="mergedStyle.button"
        :variables="mergedVariables"
      >
        {{ loading ? Text.LoadingButton : mergedLabels.submit }}
      </component>
    </template>
    <template v-else>
      <Code
        :style="mergedStyle"
        :variables="mergedVariables"
        :labels="mergedLabels"
        :registration="registration"
        :codeValid="codeValid"
        :handleCode="handleCode"
        :Input="Input"
        :Message="Message"
        :Button="Button"
        :Error="Error"
      />
    </template>
  </component>
</template>

<script>
import { markRaw } from 'vue'
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
  initializePolling,
  confirm,
  app,
} from 'iltio'
import Phone from './Phone.vue'
import Tabs from './Tabs.vue'
import Code from './Code.vue'
import Form from './components/Form.vue'
import Input from './components/Input.vue'
import Button from './components/Button.vue'
import Message from './components/Message.vue'
import Error from './components/Error.vue'
import PhoneWrapper from './components/PhoneWrapper.vue'
import PhoneTop from './components/PhoneTop.vue'
import PhoneInput from './components/PhoneInput.vue'
import PhoneCountryOptions from './components/PhoneCountryOptions.vue'
import PhoneCountryOption from './components/PhoneCountryOption.vue'
import PhoneCountry from './components/PhoneCountry.vue'
import TabWrapper from './components/TabWrapper.vue'
import Tab from './components/Tab.vue'

export default {
  props: {
    configuration: Object,
    allowPhone: { type: Boolean, default: true },
    allowMail: { type: Boolean, default: true },
    initialCountryCode: { type: String, default: 'us' },
    style: { type: Object, default: () => ({ phoneCountry: {}, phoneCountryOption: {} }) },
    variables: { type: Object, default: () => ({ ...defaultVariables }) },
    labels: { type: Object, default: () => ({ ...defaultLabels }) },
    onSuccess: { type: Function, required: true },
    Components: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      tab: this.allowMail ? 'mail' : 'phone',
      mail: '',
      phone: '',
      mailValid: true,
      phoneValid: true,
      loading: false,
      submitted: Store.codeToken !== '',
      registration: false,
      error: '',
      codeValid: true,
      Text,
      Label,
      Input: markRaw(this.Components.Input || Input),
      Form: markRaw(this.Components.Form || Form),
      Button: markRaw(this.Components.Button || Button),
      Message: markRaw(this.Components.Message || Message),
      Error: markRaw(this.Components.Error || Error),
      PhoneWrapper: markRaw(this.Components.PhoneWrapper || PhoneWrapper),
      PhoneTop: markRaw(this.Components.PhoneTop || PhoneTop),
      PhoneInput: markRaw(this.Components.PhoneInput || PhoneInput),
      PhoneCountryOptions: markRaw(this.Components.PhoneCountryOptions || PhoneCountryOptions),
      PhoneCountryOption: markRaw(this.Components.PhoneCountryOption || PhoneCountryOption),
      PhoneCountry: markRaw(this.Components.PhoneCountry || PhoneCountry),
      TabWrapper: markRaw(this.Components.TabWrapper || TabWrapper),
      Tab: markRaw(this.Components.Tab || Tab),
      countryCode: this.initialCountryCode.toLowerCase(),
    }
  },
  components: {
    Code,
    Tabs,
    Phone,
  },
  computed: {
    mergedStyle() {
      return Object.assign({ phoneCountry: {}, phoneCountryOption: {} }, this.style)
    },
    mergedVariables() {
      return Object.assign({ ...defaultVariables }, this.variables)
    },
    mergedLabels() {
      return Object.assign({ ...defaultLabels }, this.labels)
    },
    multipleInputs() {
      return this.allowMail && this.allowPhone
    },
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

      initializePolling(
        this.onSuccess,
        () => {
          this.submitted = false
          this.error = Text.CodeExpiredError
        },
        this.registration
      )
    },
    async handleCode(code) {
      if (code.length === 4) {
        this.error = ''
        const { error: localError, token: userToken } = await confirm(code)

        if (localError) {
          if (localError === 'Code invalid or expired.') {
            Store.removeCodeToken()
            this.submitted = false
            this.error = Text.CodeExpiredError
          }

          if (localError === 'Wrong code entered.') {
            this.codeValid = false
          }
          return
        }

        if (app.pollInterval) {
          clearInterval(app.pollInterval)
          app.pollInterval = 0
        }

        if (userToken) {
          Store.token = userToken
          Store.removeCodeToken()
          if (this.onSuccess) {
            this.onSuccess(Store.name, userToken, this.registration)
          }
        }
      } else {
        this.codeValid = true
      }
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
    initializePolling(
      this.onSuccess,
      () => {
        this.submitted = false
        this.error = Text.CodeExpiredError
      },
      this.registration
    )

    if (this.configuration) {
      configure(this.configuration)
    }
  },
}
</script>
