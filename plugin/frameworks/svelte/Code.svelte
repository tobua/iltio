<script>
  import { Label, Text } from 'iltio'
  import Resend from './Resend.svelte'

  export let Components, style, variables, labels, registration, codeValid, handleCode, tab
</script>

{#if registration}
  <Components.Message aria-label={Label.registration} style={style.message} {variables}>
    {Text.RegistrationMessage}
  </Components.Message>
{/if}
<Components.Message aria-label={Label.messageConfirm} style={style.message} {variables}>
  {tab === 'mail' ? Text.CodeSentMessage : Text.CodeSentMessagePhone}
</Components.Message>
<Components.Input
  aria-label={Label.inputCode}
  on:input={(event) => handleCode(event.target.value)}
  valid={codeValid}
  required
  placeholder={Text.CodeInputPlaceholder}
  type="number"
  maxlength={4}
  style="text-align: center; {style.inputCode}"
  {variables}
/>
<Resend {Components} {labels} {variables} {style} />
