import React, { useState, useCallback, FormEventHandler, useEffect } from 'react'
import {
  Variables,
  Label,
  Text,
  defaultVariables,
  user,
  defaultLabels,
  toggleEncryption,
  Labels,
  Store,
} from 'iltio'
import { Styles, ComponentTypes } from './types'
import { components } from './components'

type Stage<T extends string> = {
  name: string
  next?: (...args: T[]) => { [key in T]: string } | string | undefined
}

// NOTE generic arrow function in TSX requires the ",".
const useFlow = <T extends string>(stages: Stage<T>[]) => {
  const [currentStage, setCurrentStage] = useState(stages[0].name)

  const nextStage = useCallback(
    (...args: T[]) => {
      const currentStageIndex = stages.findIndex((stage) => stage.name === currentStage)
      const nextStageName = stages[currentStageIndex].next
        ? stages[currentStageIndex].next()
        : stages[0].name

      if (typeof nextStageName === 'string') {
        setCurrentStage(nextStageName)
      }

      if (typeof nextStageName === 'object') {
        setCurrentStage(nextStageName[args[0]])
      }
    },
    [stages, currentStage, setCurrentStage],
  )

  return [currentStage, nextStage] as [string, (...args: T[]) => void]
}

interface Props {
  variables?: Variables
  Components?: ComponentTypes
  style?: Styles
  labels?: Labels
  onDone?: () => void
}

export function Encryption({
  variables = defaultVariables,
  Components = components,
  style = {},
  labels = defaultLabels,
  onDone,
}: Props) {
  const [stage, nextStage] = useFlow<string>([
    { name: 'status', next: () => ({ false: 'enable', true: 'disable' }) },
    { name: 'enable', next: () => 'show-code' },
    { name: 'disable' },
    { name: 'show-code' },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleToggle = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      setError('')
      setLoading(true)

      const { error: localError, encrypted: localEncrypted } = await toggleEncryption()

      if (localError) {
        setError(typeof localError === 'string' ? localError : 'Unknown error')
      }

      setLoading(false)

      if (stage === 'disable') {
        onDone()
      }

      nextStage()
    },
    [stage],
  )

  useEffect(() => {
    setError('')

    if (stage === 'status') {
      user().then(({ error: localError, encrypted: localEncrypted }) => {
        if (localError) {
          setError(typeof localError === 'string' ? localError : 'Unknown error')
        } else {
          nextStage(String(localEncrypted))
        }

        setLoading(false)
      })
    }
  }, [stage])

  if (!Store.token) {
    return (
      <Components.Error style={style.error} variables={variables} aria-label={Label.inputError}>
        {Text.EncryptionNoToken}
      </Components.Error>
    )
  }

  return (
    <Components.Form aria-label={Label.form} style={style.form} variables={variables}>
      {stage === 'status' && (
        <Components.Message
          aria-label={Label.encryptionLoading}
          style={style.message}
          variables={variables}
        >
          {Text.EncryptionLoadingStatus}
        </Components.Message>
      )}
      {stage === 'enable' && (
        <Components.Button
          aria-label={Label.encryptionEnable}
          onClick={handleToggle}
          type="button"
          style={style.button}
          variables={variables}
        >
          {labels.encrypt}
        </Components.Button>
      )}
      {stage === 'disable' && (
        <Components.Button
          aria-label={Label.encryptionDisable}
          onClick={handleToggle}
          type="button"
          style={style.button}
          variables={variables}
        >
          {loading ? Text.EncryptionDisabling : labels.decrypt}
        </Components.Button>
      )}
      {stage === 'show-code' && (
        <>
          <Components.Message
            aria-label={Label.encryptionCode}
            style={style.message}
            variables={variables}
          >
            123456789
          </Components.Message>
          <Components.Button
            aria-label={Label.encryptionDone}
            onClick={() => {
              onDone()
              nextStage()
            }}
            type="button"
            style={style.button}
            variables={variables}
          >
            {Text.EncryptionClose}
          </Components.Button>
        </>
      )}
      {error && (
        <Components.Error style={style.error} variables={variables} aria-label={Label.inputError}>
          {error}
        </Components.Error>
      )}
    </Components.Form>
  )
}
