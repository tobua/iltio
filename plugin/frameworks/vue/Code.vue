<template>
  <div>
    <Components.Message
      v-if="registration"
      aria-label="registration"
      :style="style.message"
      :variables="variables"
    >
      {{ Text.RegistrationMessage }}
    </Components.Message>
    <Components.Message :style="style.message" :variables="variables">
      {{ Text.CodeSentMessage }}
    </Components.Message>
    <Components.Input
      aria-label="inputNumber"
      @change="handleCode"
      :valid="codeValid"
      required
      :placeholder="Text.CodeInputPlaceholder"
      type="number"
      :maxlength="4"
      :style="{ textAlign: 'center', ...style.inputCode }"
      :variables="variables"
    />
    <Resend :components="components" :labels="labels" :variables="variables" :style="style" />
  </div>
</template>

<script>
import { Label, Text } from 'iltio'
import Resend from './Resend.vue'

export default {
  name: 'Code',
  props: {
    Components: {
      type: Object,
      required: true,
    },
    Resend,
    style: {
      type: Object,
      required: true,
    },
    variables: {
      type: Object,
      required: true,
    },
    labels: {
      type: Object,
      required: true,
    },
    registration: {
      type: Boolean,
      required: true,
    },
    codeValid: {
      type: Boolean,
      required: true,
    },
    handleCode: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      Text,
      Label,
    }
  },
}
</script>
