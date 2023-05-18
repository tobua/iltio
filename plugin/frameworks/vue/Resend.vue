<template>
  <Button
    :aria-label="Label.resendCode"
    @click="handleResend"
    type="button"
    :style="style.button"
    :variables="variables"
  >
    {{ loading ? 'Loading...' : labels.resend }}
  </Button>
  <Error v-if="error" :style="style.error" :variables="variables">
    {{ error }}
  </Error>
  <Message v-if="success" :style="style.message" :variables="variables">
    {{ success }}
  </Message>
</template>

<script>
import { Label } from 'iltio'
import Button from './components/Button.vue'
import Error from './components/Error.vue'
import Message from './components/Message.vue'

export default {
  name: 'Resend',
  props: {
    style: Object,
    variables: Object,
    labels: Object,
  },
  data() {
    return {
      loading: false,
      error: '',
      success: '',
      Label,
    }
  },
  components: {
    Button,
    Error,
    Message,
  },
  methods: {
    async handleResend() {
      this.loading = true
      this.error = ''
      this.success = ''

      setTimeout(() => {
        const success = Math.random() > 0.5

        this.loading = false

        if (!success) {
          this.error = 'Failed to resend code, please try again.'
        } else {
          this.success = 'A new code is being sent to you.'
        }
      }, 2000)
    },
  },
}
</script>
