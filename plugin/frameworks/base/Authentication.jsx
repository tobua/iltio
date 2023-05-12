import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Label, Text, defaultVariables, defaultLabels, Store, app, configure } from 'iltio'
import { Phone } from './Phone'
import { components } from './Components'
import { Tabs } from './Tabs'
import { Code } from './Code'

export function Authentication({
  allowPhone = true,
  allowMail = true,
  onSuccess,
  initialCountryCode = 'us',
  style = {},
  variables = defaultVariables,
  labels = {},
  Components = components,
}) {
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

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      const success = Math.random() > 0.5

      setLoading(false)
      setMailValid(success)
      setPhoneValid(success)
      setRegistration(success)
      setSubmitted(success)

      if (!success) {
        setError('Please enter a valid mail address or phone number.')
      }
    }, 2000)
  }, [])

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
    async function checkVerified() {
      console.log('check verified')
    }

    checkVerified()
  }, [])

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
            <Components.Error style={style.error} variables={variables}>
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
