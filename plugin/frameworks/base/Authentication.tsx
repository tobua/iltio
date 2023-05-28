import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Label,
  Text,
  defaultVariables,
  defaultLabels,
  Store,
  app,
  configure,
  validateEmail,
  validatePhone,
  countries,
  authenticate,
  initializePolling,
} from 'iltio'
import { Phone } from './Phone.js'
import { components } from './Components.js'
import { Tabs } from './Tabs.js'
import { Code } from './Code.js'

export function Authentication({
  allowPhone = true,
  allowMail = true,
  onSuccess,
  initialCountryCode = 'us',
  style = {},
  variables = defaultVariables,
  labels = {},
  Components = components,
  configuration = {},
}: any) {
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

  Components = useMemo(() => ({ ...components, ...Components }), [Components])
  variables = useMemo(() => ({ ...defaultVariables, ...variables }), [variables])
  labels = useMemo(() => ({ ...defaultLabels, ...labels }), [labels])
  style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLButtonElement>) => {
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

  const handleCode = useCallback((code) => {
    setCodeValid(true)

    const success = Math.random() > 0.5
    if (success && code.length === 4) {
      onSuccess(Store.name, '123', true)
    }

    if (!success && code.length === 4) {
      setCodeValid(false)
    }

    if (code.length > 4) {
      setCodeValid(false)
    }
  }, [])

  useEffect(() => {
    initializePolling(
      onSuccess,
      () => {
        setSubmitted(false)
        setError(Text.CodeExpiredError)
      },
      registration
    )

    if (configuration) {
      configure(configuration)
    }
  }, [registration, configuration, onSuccess, submitted]) // submitted necessary!

  return (
    <Components.Form
      aria-label={Label.form}
      onSubmit={handleSubmit}
      style={style.form}
      variables={variables}
    >
      {!submitted && (
        <>
          <Tabs
            multipleInputs={multipleInputs}
            tab={tab}
            Components={Components}
            setTab={setTab}
            style={style}
            variables={variables}
            labels={labels}
          />
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
            <Components.Error
              aria-label={Label.inputError}
              style={style.error}
              variables={variables}
            >
              {error}
            </Components.Error>
          )}
          <Components.Button
            aria-label={Label.submit}
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
        <Code
          Components={Components}
          style={style}
          variables={variables}
          labels={labels}
          registration={registration}
          codeValid={codeValid}
          handleCode={handleCode}
        />
      )}
    </Components.Form>
  )
}
