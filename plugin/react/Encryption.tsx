import { useState, useCallback, FormEventHandler, useEffect } from 'react'
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
  generateEncryptionKey,
  encryptText,
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
  const [encryptionKey, setEncryptionKey] = useState('')
  const [encryptionText, setEncryptionText] = useState('')

  const handleToggle = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      setError('')
      setLoading(true)

      let response = { error: true, encrypted: false }
      let key: string | false = false

      if (stage === 'enable') {
        key = await generateEncryptionKey()
        Store.encryptionKey = key as string
        const encryptedText = await encryptText('Hello Encryption')
        response = await toggleEncryption(Store.token, encryptedText)
      } else {
        response = await toggleEncryption()
      }

      if (response.error) {
        setError(typeof response.error === 'string' ? response.error : 'Unknown error')
        return
      }

      setLoading(false)

      if (stage === 'disable') {
        onDone()
      }

      if (stage === 'enable') {
        if (!key) {
          setError('Unable to generate encryption key.')
          return
        }
        Store.encryptionKey = key
        setEncryptionKey(key)
      }

      nextStage()
    },
    [stage],
  )

  useEffect(() => {
    setError('')

    if (stage === 'status') {
      user().then(
        ({ error: localError, encrypted: localEncrypted, encryptionText: localEncryptionText }) => {
          if (localError) {
            setError(typeof localError === 'string' ? localError : 'Unknown error')
          } else {
            setEncryptionText(localEncryptionText)
            nextStage(String(localEncrypted))
          }

          setLoading(false)
        },
      )
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
          {loading ? Text.EncryptionEnabling : labels.encrypt}
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
            {Text.EncryptionKeyGenerated}
          </Components.Message>
          <Components.Input
            style={style.inputMail}
            variables={variables}
            value={encryptionKey}
            type="text"
            disabled={true}
          />
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
