import React, { useCallback, useState } from 'react'
import { Variables, Styles, Labels, ComponentTypes } from './types'
import { Label } from './label'
import { resend } from './route'

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

  const handleReset = useCallback(async () => {
    setLoading(true)
    setError('')

    const { error: localError } = await resend()

    if (localError) {
      setError(typeof localError === 'string' ? localError : 'An error occurred.')
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
        {loading ? 'Loading...' : labels.resend}
      </Components.Button>
      {error && (
        <Components.Error style={style.error} variables={variables}>
          {error}
        </Components.Error>
      )}
    </>
  )
}
