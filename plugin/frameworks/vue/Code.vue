<template>
  <Message
    v-if="registration"
    :aria-label="Label.registration"
    :style="style.message"
    :variables="variables"
  >
    {{ Text.RegistrationMessage }}
  </Message>
  <Message :aria-label="Label.messageConfirm" :style="style.message" :variables="variables">
    {{ Text.CodeSentMessage }}
  </Message>
  <Input
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
  <Resend :labels="labels" :variables="variables" :style="style" />
</template>

<script>
import { Label, Text } from 'iltio'
import Resend from './Resend.vue'
import Message from './components/Message.vue'
import Input from './components/Input.vue'

export default {
  props: {
    style: Object,
    variables: Object,
    labels: Object,
    registration: Boolean,
    codeValid: Boolean,
    handleCode: Function,
  },
  components: {
    Resend,
    Input,
    Message,
  },
  data() {
    return {
      Text,
      Label,
    }
  },
}
</script>
