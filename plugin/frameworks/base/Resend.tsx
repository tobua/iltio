import React, { useCallback, useState } from 'react'
import { Label, Text } from 'iltio'

export function Resend({ Components, style, variables, labels }: any) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleReset = useCallback(async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    setTimeout(() => {
      const success = Math.random() > 0.5

      setLoading(false)

      if (!success) {
        setError('Failed to resend code, please try again.')
      } else {
        setSuccess('A new code is being sent to you.')
      }
    }, 2000)
  }, [])

  return (
    <>
      <Components.Button
        aria-label={Label.resendCode}
        onClick={handleReset}
        type="button"
        style={style.button}
        variables={variables}
      >
        {loading ? Text.LoadingButton : labels.resend}
      </Components.Button>
      {error && (
        <Components.Error style={style.error} variables={variables}>
          {error}
        </Components.Error>
      )}
      {success && (
        <Components.Message style={style.message} variables={variables}>
          {success}
        </Components.Message>
      )}
    </>
  )
}
