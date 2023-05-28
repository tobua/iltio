import React, { useCallback, useState } from 'react'
import { Variables, Labels } from 'iltio'
import { Styles, ComponentTypes } from './types.js'
import { Label, Text } from '../text.js'
import { resend } from '../route.js'

export function Resend({
  Components,
  style,
  variables,
  labels,
}: {
  Components: ComponentTypes
  style: Styles
  variables: Variables
  labels: Labels
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleReset = useCallback(async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const { error: localError } = await resend()

    if (localError) {
      setError(typeof localError === 'string' ? localError : Text.UnknownError)
    } else {
      setSuccess(Text.CodeResentMessage)
    }

    setLoading(false)
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
