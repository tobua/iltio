import React, { FormEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { Label, Text } from '../text'
import { Phone } from './Phone'
import { components } from './components'
import { Props } from '../types'
import { Store, app, configure } from '../store'
import { authenticate, confirm, poll } from '../route'
import { defaultVariables, defaultLabels, validateEmail, validatePhone } from '../helper'
import { countries } from '../data/countries'
import { Resend } from './Resend'

// TODO rename to Authentication as well.
// TODO export as ./react
export function Form({
  configuration,
  allowPhone = true,
  allowMail = true,
  onSuccess,
  initialCountryCode = 'us',
  style = {},
  variables = defaultVariables,
  labels = {},
  Components = components,
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
    [mail, phone, allowMail, allowPhone, tab]
  )

  // TODO return backend errors as status code numbers.
  const handleCode = useCallback(
    async (code: string) => {
      if (code.length === 4) {
        setError('')
        const { error: localError, token: userToken } = await confirm(code)

        if (localError) {
          if (localError === 'Code invalid or expired.') {
            Store.removeCodeToken()
            setSubmitted(false)
            setError(Text.CodeExpiredError)
          }

          if (localError === 'Wrong code entered.') {
            setCodeValid(false)
          }
          return
        }

        if (app.pollInterval) {
          clearInterval(app.pollInterval)
          app.pollInterval = 0
        }

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
    [registration]
  )

  useEffect(() => {
    async function checkVerified() {
      const { error: localError, token: userToken } = await poll()

      if (localError) {
        // Code token expired, start over.
        if (localError === 'Code expired.') {
          Store.removeCodeToken()
          setSubmitted(false)
          setError(Text.CodeExpiredError)
        }
        return
      }

      if (userToken) {
        Store.token = userToken
        Store.removeCodeToken()

        if (app.pollInterval) {
          clearInterval(app.pollInterval)
          app.pollInterval = 0
        }

        if (onSuccess) {
          onSuccess(Store.name, userToken, registration)
        }
      }
    }

    if (configuration) {
      configure(configuration)
    }

    // TODO refactor polling to fit into core.
    if (submitted) {
      // Continue polling after page reload in verification stage.
      app.pollInterval = setInterval(checkVerified, app.pollDuration)
    } else if (app.pollInterval) {
      clearInterval(app.pollInterval)
      app.pollInterval = 0
    }
  }, [submitted, registration, Store, configuration])

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
            <Components.TabWrapper style={style.tabWrapper} variables={variables}>
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
            />
          )}
          {error && (
            <Components.Error style={style.error} variables={variables}>
              {error}
            </Components.Error>
          )}
          <Components.Button
            aria-label={Label.submit}
            // @ts-ignore NOTE form submit not working with testing-library.
            onClick={handleSubmit}
            type="submit"
            style={style.button}
            variables={variables}
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
          <Components.Message style={style.message} variables={variables}>
            {Text.CodeSentMessage}
          </Components.Message>
          <Components.Input
            aria-label={Label.inputNumber}
            onChange={(event) => handleCode(event.target.value)}
            valid={codeValid}
            required
            placeholder={Text.CodeInputPlaceholder}
            type="number"
            maxLength={4}
            style={{ textAlign: 'center', ...style.inputCode }}
            variables={variables}
          />
          <Resend Components={Components} labels={labels} variables={variables} style={style} />
        </>
      )}
    </Components.Form>
  )
}
