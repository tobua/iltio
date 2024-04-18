import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
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
} from 'iltio'
import { Phone } from './Phone'
import { components } from './components'
import { Props, ComponentTypes, Styles } from './types'
import { Resend } from './Resend'

export { ComponentTypes, Props, Styles }

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
  const [mail, setMail] = useState('')
  const [phone, setPhone] = useState('')
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

  // eslint-disable-next-line no-param-reassign
  Components = useMemo(() => ({ ...components, ...Components }), [Components])
  // eslint-disable-next-line no-param-reassign
  variables = useMemo(() => ({ ...defaultVariables, ...variables }), [variables])
  // eslint-disable-next-line no-param-reassign
  labels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  // eslint-disable-next-line no-param-reassign
  style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

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

      if (localError) {
        setError(localError === true ? Text.UnknownError : localError)
        return
      }
      setRegistration(localRegistration)
      setSubmitted(true)
    },
    [mail, phone, allowMail, allowPhone, tab],
  )

  // TODO return backend errors as status code numbers.
  const handleCode = useCallback(
    async (code: string) => {
      if (code.length === 4) {
        setError('')
        setValidatingCode(true)
        const { error: localError, token: userToken } = await confirm(code)

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

        if (userToken) {
          Store.token = userToken
          Store.removeCodeToken()
          if (onSuccess) {
            onSuccess(Store.name, userToken, registration)
          }
        }
      } else {
        setCodeValid(true)
      }
    },
    [registration],
  )

  useEffect(() => {
    initializePolling(
      onSuccess,
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
