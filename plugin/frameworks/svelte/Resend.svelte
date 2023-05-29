<script>
  import { Label, Text, resend } from 'iltio'

  export let Components, style, variables, labels
  let loading = false
  let error = ''
  let success = ''

  const handleResend = async () => {
    loading = true
    error = ''
    success = ''

    const { error: localError } = await resend()

    if (localError) {
      error = typeof localError === 'string' ? localError : Text.UnknownError
    } else {
      success = Text.CodeResentMessage
    }

    loading = false
  }
</script>

<Components.Button
  aria-label={Label.resendCode}
  on:click={handleResend}
  type="button"
  style={style.button}
  {variables}
>
  {#if loading}
    {Text.LoadingButton}
  {:else}
    {labels.resend}
  {/if}
</Components.Button>
{#if error}
  <Components.Error style={style.error} {variables}>
    {error}
  </Components.Error>
{/if}
{#if success}
  <Components.Message style={style.message} {variables}>
    {success}
  </Components.Message>
{/if}
