<template>
  <div>
    <Components.Button
      aria-label="resend code"
      @click="handleReset"
      type="button"
      :style="style.button"
      :variables="variables"
    >
      {{ loading ? 'Loading...' : labels.resend }}
    </Components.Button>
    <Components.Error v-if="error" :style="style.error" :variables="variables">
      {{ error }}
    </Components.Error>
    <Components.Message v-if="success" :style="style.message" :variables="variables">
      {{ success }}
    </Components.Message>
  </div>
</template>

<script>
import { Label, Text } from 'iltio'

export default {
  name: 'Resend',
  props: {
    Components: {
      type: Object,
      required: true,
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    variables: {
      type: Object,
      default: () => ({}),
    },
    labels: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      error: '',
      success: '',
    }
  },
  methods: {
    async handleReset() {
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
