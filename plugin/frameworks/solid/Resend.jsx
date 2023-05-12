import { createSignal } from 'solid-js'
import { Label, resend } from 'iltio'

export function Resend(props) {
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal('')

  const handleReset = async () => {
    setLoading(true)
    setError('')

    const { error: localError } = await resend()

    if (localError) {
      setError(typeof localError === 'string' ? localError : 'An error occurred.')
    }

    setLoading(false)
  }

  return (
    <>
      <props.Components.Button
        aria-label={Label.resendCode}
        onClick={handleReset}
        type="button"
        style={props.style.button}
        variables={props.variables}
      >
        {loading() ? 'Loading...' : props.labels.resend}
      </props.Components.Button>
      {error() && (
        <props.Components.Error style={props.style.error} variables={props.variables}>
          {error()}
        </props.Components.Error>
      )}
    </>
  )
}
