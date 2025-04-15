import { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Store,
  configure,
  Label,
  Text,
  authenticate,
  confirm,
  defaultVariables,
  defaultLabels,
  validateEmail,
  validatePhone,
  countries,
  initializePolling,
  stopPolling,
  encryptText,
  removeCryptoKey,
  getInitialName,
} from 'iltio'
import { Phone } from './Phone'
import { components } from './components'
import { Props, ComponentTypes, Styles } from './types'
import { Resend } from './Resend'
import { Encryption } from './Encryption'

export { ComponentTypes, Props, Styles, Encryption }

export function Authentication({
  configuration,
  allowPhone = true,
  allowMail = true,
  onSuccess,
  initialCountryCode = 'us',
  style = {},
  variables = defaultVariables,
  labels = {},
  Components = components,
  isReactNative = false,
}: Props) {
  const [tab, setTab] = useState(allowMail ? 'mail' : 'phone')
  const [mail, setMail] = useState(getInitialName('mail', allowMail, allowPhone))
  const [phone, setPhone] = useState(getInitialName('phone', allowMail, allowPhone))
  const [countryCode, setCountryCode] = useState(initialCountryCode.toLowerCase())
  const [mailValid, setMailValid] = useState(true)
  const [phoneValid, setPhoneValid] = useState(true)
  const multipleInputs = allowMail && allowPhone
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(Store.codeToken !== '')
  const [registration, setRegistration] = useState(false)
  const [error, setError] = useState('')
  const [codeValid, setCodeValid] = useState(true)
  const [validatingCode, setValidatingCode] = useState(false)
  const [userToken, setUserToken] = useState('')
  const [jsonWebToken, setJsonWebToken] = useState({ token: '', expirationDate: '' })
  const [uid, setUid] = useState('')
  const [encrypted, setEncrypted] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState('')
  const [encryptionKeyValid, setEncryptionKeyValid] = useState(true)
  const [encryptionText, setEncryptionText] = useState('')
  const [encryptionError, setEncryptionError] = useState('')

  // eslint-disable-next-line no-param-reassign
  Components = useMemo(() => ({ ...components, ...Components }), [Components])
  // eslint-disable-next-line no-param-reassign
  variables = useMemo(() => ({ ...defaultVariables, ...variables }), [variables])
  // eslint-disable-next-line no-param-reassign
  labels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  // eslint-disable-next-line no-param-reassign
  style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

  function resetState() {
    setTab(allowMail ? 'mail' : 'phone')
    setMail(getInitialName('mail', allowMail, allowPhone))
    setPhone(getInitialName('phone', allowMail, allowPhone))
    setCountryCode(initialCountryCode.toLowerCase())
    setMailValid(true)
    setPhoneValid(true)
    setLoading(false)
    Store.codeToken = ''
    setSubmitted(false)
    setRegistration(false)
    setError('')
    setCodeValid(true)
    setValidatingCode(false)
    setUserToken('')
    setJsonWebToken({ token: '', expirationDate: '' })
    setUid('')
    setEncrypted(false)
    setEncryptionKey('')
    setEncryptionKeyValid(true)
    setEncryptionText('')
    setEncryptionError('')
  }

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      setError('')
      let name: string

      if (tab === 'mail' && allowMail) {
        const currentMailValid = validateEmail(mail)
        setMailValid(currentMailValid)
        if (!currentMailValid) {
          setError(Text.InvalidMailError)
          return
        }
        name = mail
      }

      if (tab === 'phone' && allowPhone) {
        const removeLeadingZeros = String(Number(phone))
        const fullPhone = countries[countryCode].prefix + removeLeadingZeros
        const currentPhoneValid = validatePhone(fullPhone)
        setPhoneValid(currentPhoneValid)
        if (!currentPhoneValid) {
          setError(Text.InvalidPhoneNumberError)
          return
        }
        name = fullPhone
      }

      setLoading(true)

      const {
        codeToken,
        error: localError,
        registration: localRegistration,
      } = await authenticate(name)

      if (codeToken) {
        Store.codeToken = codeToken
        Store.name = name
      }

      setLoading(false)
      setEncrypted(encrypted)

      if (localError) {
        setError(localError === true ? Text.UnknownError : localError)
        return
      }
      setRegistration(localRegistration)
      setSubmitted(true)
    },
    [mail, phone, allowMail, allowPhone, tab],
  )

  const handleEncryptionKey = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      setError('')
      setEncryptionKeyValid(true)

      Store.encryptionKey = encryptionKey
      removeCryptoKey()
      let currentEncryptionText = ''

      try {
        currentEncryptionText = await encryptText('Hello Encryption')
      } catch (error) {
        // Key probably too short, validate directly once length defined.
        setEncryptionKeyValid(false)
        setEncryptionError('Wrong encryption key length.')
        return
      }

      if (currentEncryptionText === encryptionText) {
        Store.token = userToken
        if (jsonWebToken) {
          Store.jsonWebToken = jsonWebToken
        }
        Store.uid = uid
        onSuccess(
          Store.name,
          Store.token,
          uid,
          registration,
          encrypted,
          encryptionText,
          jsonWebToken,
        )
        resetState()
      } else {
        setEncryptionKeyValid(false)
        setEncryptionError('Wrong encryption key entered.')
      }
    },
    [encryptionKey],
  )

  // TODO return backend errors as status code numbers.
  const handleCode = useCallback(
    async (code: string) => {
      if (code.length === 4) {
        setError('')
        setValidatingCode(true)
        const {
          error: localError,
          token: localUserToken,
          jsonWebToken: localJsonWebToken,
          encrypted: localEncrypted,
          encryptionText: localEncryptionText,
          uid: localUid,
        } = await confirm(code)

        setValidatingCode(false)

        if (localError) {
          if (localError === 'Code invalid or expired.') {
            Store.removeCodeToken()
            setSubmitted(false)
            setError(Text.CodeExpiredError)
          }

          setCodeValid(false)
          setError(typeof localError === 'string' ? localError : Text.UnknownError)

          return
        }

        stopPolling()

        if (localUserToken) {
          Store.removeCodeToken()
          if (localEncrypted) {
            setUserToken(localUserToken)
            setJsonWebToken(localJsonWebToken)
            setUid(localUid)
            setEncrypted(localEncrypted)
            setEncryptionText(localEncryptionText)
          } else if (onSuccess) {
            Store.token = localUserToken
            if (localJsonWebToken) {
              Store.jsonWebToken = localJsonWebToken
            }
            Store.uid = localUid
            onSuccess(
              Store.name,
              localUserToken,
              localUid,
              registration,
              localEncrypted,
              localEncryptionText,
              localJsonWebToken,
            )
            resetState()
          }
        }
      } else {
        setCodeValid(true)
      }
    },
    [registration],
  )

  const handlePollingSuccess = useCallback(
    (
      _name: string,
      localUserToken: string,
      localUid: string,
      registration: boolean,
      localEncrypted: boolean,
      localEncryptionText?: string,
      localJsonWebToken?: { token: string; expirationDate: string },
    ) => {
      if (localEncrypted) {
        setUid(localUid)
        setEncrypted(localEncrypted)
        setEncryptionText(localEncryptionText)
        setJsonWebToken(localJsonWebToken)
      } else if (onSuccess) {
        Store.token = localUserToken
        if (localJsonWebToken) {
          Store.jsonWebToken = localJsonWebToken
        }
        onSuccess(
          Store.name,
          localUserToken,
          localUid,
          registration,
          localEncrypted,
          localEncryptionText,
          localJsonWebToken,
        )
        resetState()
      }
    },
    [],
  )

  useEffect(() => {
    initializePolling(
      handlePollingSuccess,
      () => {
        setSubmitted(false)
        setError(Text.CodeExpiredError)
      },
      registration,
    )

    if (configuration) {
      configure(configuration)
    }
  }, [registration, configuration, onSuccess, submitted])

  if (encrypted) {
    return (
      <Components.Form
        aria-label={Label.form}
        onSubmit={handleEncryptionKey}
        style={style.form}
        variables={variables}
      >
        <Components.Message
          aria-label={Label.encryptionEnterKey}
          style={style.message}
          variables={variables}
        >
          {Text.EncryptionEnterKey}
        </Components.Message>
        <Components.Input
          aria-label={Label.encryptionInputKey}
          aria-invalid={!encryptionKeyValid}
          autoFocus
          value={encryptionKey}
          onChange={(event) => {
            setEncryptionKeyValid(true)
            setEncryptionKey(event.target.value)
          }}
          required
          valid={encryptionKeyValid}
          variables={variables}
          style={style.inputMail}
          placeholder={Text.EncryptionInputPlaceholder}
          type="text"
          {...(isReactNative ? { onSubmitEditing: handleEncryptionKey } : {})}
        />
        {encryptionError && (
          <Components.Error
            style={style.error}
            variables={variables}
            aria-label={Label.encryptionError}
          >
            {encryptionError}
          </Components.Error>
        )}
        <Components.Button
          aria-label={Label.encryptionKeySubmit}
          type="submit"
          style={style.button}
          variables={variables}
          onClick={(event: any) => isReactNative && handleEncryptionKey(event)}
        >
          {loading ? Text.LoadingButton : Text.EncryptionSubmitKey}
        </Components.Button>
      </Components.Form>
    )
  }

  return (
    <Components.Form
      aria-label={Label.form}
      onSubmit={handleSubmit}
      style={style.form}
      variables={variables}
    >
      {!submitted && (
        <>
          {multipleInputs && (
            <Components.TabWrapper
              style={style.tabWrapper}
              variables={variables}
              aria-label={Label.tabWrapper}
            >
              <Components.Tab
                aria-label={Label.tabMail}
                active={tab === 'mail'}
                onClick={() => setTab('mail')}
                variables={variables}
                style={style.tab}
              >
                {labels.tabMail}
              </Components.Tab>
              <Components.Tab
                aria-label={Label.tabPhone}
                active={tab === 'phone'}
                onClick={() => setTab('phone')}
                variables={variables}
                style={style.tab}
              >
                {labels.tabPhone}
              </Components.Tab>
            </Components.TabWrapper>
          )}
          {allowMail && (!multipleInputs || tab === 'mail') && (
            <Components.Input
              aria-label={Label.inputMail}
              aria-invalid={!mailValid}
              value={mail}
              onChange={(event) => setMail(event.target.value)}
              required
              valid={mailValid}
              variables={variables}
              style={style.inputMail}
              placeholder={Text.MailInputPlaceholder}
              type="email"
              {...(isReactNative ? { onSubmitEditing: handleSubmit } : {})}
            />
          )}
          {allowPhone && (!multipleInputs || tab === 'phone') && (
            <Phone
              variables={variables}
              phoneValid={phoneValid}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phone={phone}
              setPhone={setPhone}
              Components={Components}
              style={style}
              {...(isReactNative ? { onSubmitEditing: handleSubmit } : {})}
            />
          )}
          {error && (
            <Components.Error
              style={style.error}
              variables={variables}
              aria-label={Label.inputError}
            >
              {error}
            </Components.Error>
          )}
          <Components.Button
            aria-label={Label.submit}
            type="submit"
            style={style.button}
            variables={variables}
            onClick={(event: any) => isReactNative && handleSubmit(event)}
          >
            {loading ? Text.LoadingButton : labels.submit}
          </Components.Button>
        </>
      )}
      {submitted && (
        <>
          {registration && (
            <Components.Message
              aria-label={Label.registration}
              style={style.message}
              variables={variables}
            >
              {Text.RegistrationMessage}
            </Components.Message>
          )}
          <Components.Message
            aria-label={Label.messageConfirm}
            style={style.message}
            variables={variables}
          >
            {tab === 'mail' ? Text.CodeSentMessage : Text.CodeSentMessagePhone}
          </Components.Message>
          <Components.CodeInputWrapper>
            <Components.Input
              aria-label={Label.inputCode}
              autoFocus
              onChange={(event: any) => handleCode(event.target.value)}
              valid={codeValid}
              required
              placeholder={Text.CodeInputPlaceholder}
              type="number"
              maxLength={4}
              style={{ textAlign: 'center', ...style.inputCode }}
              variables={variables}
            />
            {validatingCode && <Components.Loader variables={variables} />}
          </Components.CodeInputWrapper>
          {error && (
            <Components.Error
              style={style.error}
              variables={variables}
              aria-label={Label.inputError}
            >
              {error}
            </Components.Error>
          )}
          <Resend Components={Components} labels={labels} variables={variables} style={style} />
        </>
      )}
    </Components.Form>
  )
}
