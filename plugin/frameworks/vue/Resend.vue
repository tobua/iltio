<template>
  <component
    :is="Button"
    :aria-label="Label.resendCode"
    @click="handleResend"
    type="button"
    :style="style.button"
    :variables="variables"
  >
    {{ loading ? 'Loading...' : labels.resend }}
  </component>
  <component :is="Error" v-if="error" :style="style.error" :variables="variables">
    {{ error }}
  </component>
  <component :is="Message" v-if="success" :style="style.message" :variables="variables">
    {{ success }}
  </component>
</template>

<script>
import { Label, Text, resend } from 'iltio'

export default {
  props: {
    style: Object,
    variables: Object,
    labels: Object,
    Button: Function,
    Error: Function,
    Message: Function,
  },
  data() {
    return {
      loading: false,
      error: '',
      success: '',
      Label,
    }
  },
  methods: {
    async handleResend() {
      this.loading = true
      this.error = ''
      this.success = ''

      const { error: localError } = await resend()

      if (localError) {
        this.error = typeof localError === 'string' ? localError : Text.UnknownError
      } else {
        this.success = Text.CodeResentMessage
      }

      this.loading = false
    },
  },
}
</script>
