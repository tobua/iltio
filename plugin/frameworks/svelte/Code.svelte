<script>
  import { Label, Text } from 'iltio'
  import Resend from './Resend.svelte'

  export let Components, style, variables, labels, registration, codeValid, handleCode
</script>

{#if registration}
  <Components.Message aria-label={Label.registration} style={style.message} {variables}>
    {Text.RegistrationMessage}
  </Components.Message>
{/if}
<Components.Message style={style.message} {variables}>
  {Text.CodeSentMessage}
</Components.Message>
<Components.Input
  aria-label={Label.inputNumber}
  on:change={(event) => handleCode(event.target.value)}
  valid={codeValid}
  required
  placeholder={Text.CodeInputPlaceholder}
  type="number"
  maxlength={4}
  style="text-align: center; {style.inputCode}"
  {variables}
/>
<Resend {Components} {labels} {variables} {style} />
