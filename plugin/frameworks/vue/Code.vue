<template>
  <component
    :is="Message"
    v-if="registration"
    :aria-label="Label.registration"
    :style="style.message"
    :variables="variables"
  >
    {{ Text.RegistrationMessage }}
  </component>
  <component
    :is="Message"
    :aria-label="Label.messageConfirm"
    :style="style.message"
    :variables="variables"
  >
    {{ Text.CodeSentMessage }}
  </component>
  <component
    :is="Input"
    :aria-label="Label.inputCode"
    @input="(event) => handleCode(event.target.value)"
    :valid="codeValid"
    required
    :placeholder="Text.CodeInputPlaceholder"
    type="number"
    :maxlength="4"
    :style="{ textAlign: 'center', ...style.inputCode }"
    :variables="variables"
  />
  <Resend
    :labels="labels"
    :variables="variables"
    :style="style"
    :Button="Button"
    :Error="Error"
    :Message="Message"
  />
</template>

<script>
import { Label, Text } from 'iltio'
import Resend from './Resend.vue'

export default {
  props: {
    style: Object,
    variables: Object,
    labels: Object,
    registration: Boolean,
    codeValid: Boolean,
    handleCode: Function,
    Message: Object,
    Input: Object,
    Button: Object,
    Error: Object,
  },
  components: { Resend },
  data() {
    return {
      Text,
      Label,
    }
  },
}
</script>
