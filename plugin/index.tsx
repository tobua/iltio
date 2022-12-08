import React, { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { Label } from './label'
import { Phone, getNumberCountryPrefix } from './phone/Phone'
import { components, ComponentTypes } from './components'
import { Variables, Styles, Labels } from './types'
import { Store, app } from './store'
import { authenticate, confirm, poll } from './route'
import { defaultVariables, defaultLabels, validateEmail, validatePhone } from './helper'
import { Resend } from './resend'

export { configure, Store, MemoryStorage } from './store'

export { authenticate, poll, confirm, resend, authorize, logout, remove } from './route'
export { getNameType } from './helper'

interface Props {
  variables?: Variables
  style?: Styles
  allowPhone?: boolean
  allowMail?: boolean
  onSuccess?: (name: string, token: string, registration: boolean) => void
  initialCountryCode?: string
  Components?: ComponentTypes
  labels?: Labels
}

export function Form({
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
  Components = { ...components, ...Components }
  // eslint-disable-next-line no-param-reassign
  variables = { ...defaultVariables, ...variables }
  // eslint-disable-next-line no-param-reassign
  labels = { ...defaultLabels, ...labels }

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      setError('')
      let name: string

      if (tab === 'mail' && allowMail) {
        const currentMailValid = validateEmail(mail)
        setMailValid(currentMailValid)
        if (!currentMailValid) {
          setError('Please enter a valid mail address.')
          return
        }
        name = mail
      }

      if (tab === 'phone' && allowPhone) {
        const removeLeadingZeros = String(Number(phone))
        const fullPhone = getNumberCountryPrefix(countryCode) + removeLeadingZeros
        const currentPhoneValid = validatePhone(fullPhone)
        setPhoneValid(currentPhoneValid)
        if (!currentPhoneValid) {
          setError('Please enter a valid phone number.')
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
        setError(localError === true ? 'An unknown error occurred.' : localError)
        return
      }

      setRegistration(localRegistration)
      setSubmitted(true)
    },
    [mail, phone, allowMail, allowPhone, tab]
  )

  const handleCode = useCallback(
    async (code: string) => {
      if (code.length === 4) {
        setError('')
        const { error: localError, token } = await confirm(code)

        if (localError) {
          if (localError === 'Code invalid or expired.') {
            Store.removeCodeToken()
            setSubmitted(false)
            setError('Code expired, please try again.')
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

        if (token) {
          Store.token = token
          Store.removeCodeToken()
          if (onSuccess) {
            onSuccess(Store.name, token, registration)
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
      const { error: localError, token } = await poll()

      if (localError) {
        // Code token expired, start over.
        if (localError === 'Code expired.') {
          Store.removeCodeToken()
          setSubmitted(false)
          setError('Code expired, please try again.')
        }
        return
      }

      if (token) {
        Store.token = token
        Store.removeCodeToken()

        if (app.pollInterval) {
          clearInterval(app.pollInterval)
          app.pollInterval = 0
        }

        if (onSuccess) {
          onSuccess(Store.name, token, registration)
        }
      }
    }

    if (submitted) {
      // Continue polling after page reload in verification stage.
      app.pollInterval = setInterval(checkVerified, app.pollDuration)
    } else if (app.pollInterval) {
      clearInterval(app.pollInterval)
      app.pollInterval = 0
    }
  }, [submitted, registration, Store])

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
              placeholder="Mail"
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
            {loading ? 'Loading...' : labels.submit}
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
              A new account was created for you.
            </Components.Message>
          )}
          <Components.Message style={style.message} variables={variables}>
            Enter the code received in your mail below or click the attached link.
          </Components.Message>
          <Components.Input
            aria-label={Label.inputNumber}
            onChange={(event) => handleCode(event.target.value)}
            valid={codeValid}
            required
            placeholder="Code"
            type="number"
            maxLength={4}
            style={{ textAlign: 'center' }}
            variables={variables}
          />
          <Resend Components={Components} labels={labels} variables={variables} style={style} />
        </>
      )}
    </Components.Form>
  )
}
