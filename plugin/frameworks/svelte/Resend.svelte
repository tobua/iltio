<script>
  import { Label, Text } from 'iltio'

  export let Components, style, variables, labels
  let loading = false
  let error = ''
  let success = ''

  const handleReset = async () => {
    loading = true
    error = ''
    success = ''

    setTimeout(() => {
      const isSuccess = Math.random() > 0.5

      loading = false

      if (!isSuccess) {
        error = 'Failed to resend code, please try again.'
      } else {
        success = 'A new code is being sent to you.'
      }
    }, 2000)
  }
</script>

<Components.Button
  aria-label={Label.resendCode}
  on:click={handleReset}
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
