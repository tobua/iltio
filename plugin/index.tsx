import React, { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { Label } from './label'
import { Phone, getNumberCountryPrefix } from './phone/Phone'
import { components, ComponentTypes } from './components'
import { Variables, Styles } from './types'
import { Store, app } from './store'

// TODO eslint doesn't seem to be working in this setup, adding root=true will lead to another import error of tsconfig after editor reload.

export { configure, Store, MemoryStorage } from './store'

export const authenticate = async (name: string) => {
  const baseUrl = app.authenticateUrl || `${app.apiUrl}/authenticate`
  const response = await fetch(
    `${baseUrl}?name=${encodeURIComponent(name)}${app.apiToken ? `&token=${app.apiToken}` : ''}`
  )

  return response.json() as Promise<{
    error: boolean | string
    pollLink?: string
    codeToken?: string
    registration?: boolean
  }>
}

export const poll = async () => {
  const response = await fetch(`${app.apiUrl}/verify/poll?token=${Store.codeToken}`)

  return response.json() as Promise<{
    error: boolean | string
    token?: string
  }>
}

export const confirm = async (code: string) => {
  const response = await fetch(
    `${app.apiUrl}/verify/confirm?code=${encodeURIComponent(code)}&token=${Store.codeToken}`
  )

  return response.json() as Promise<{
    error: boolean | string
    token?: string
  }>
}

export const authorize = async (token = Store.token) => {
  const response = await fetch(`${app.apiUrl}/authorize?token=${token}`)
  const { error, role, id, name } = await response.json()

  return { error, role, id, name }
}

export const logout = async (server = false, token = Store.token) => {
  Store.removeToken()

  if (server) {
    const response = await fetch(`${app.apiUrl}/logout?token=${token}`)
    const { error } = await response.json()

    return { error }
  }
}

export const remove = async (token = Store.token) => {
  if (!token) {
    return console.error('No user logged in or token provided.')
  }

  const response = await fetch(`${app.apiUrl}/delete?token=${token}`)
  const { error } = await response.json()

  return { error }
}

const validateEmail = (value: string) => {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    value
  )
}

const validatePhone = (value: string) => {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)
}

export const getNameType = (value: string) => {
  if (validateEmail(value)) {
    return 'mail'
  }

  if (validatePhone(value)) {
    return 'phone'
  }

  return false
}

const defaultVariables = { color: 'black', contrast: 'white', borderRadius: 0 }

interface Props {
  variables?: Variables
  style?: Styles
  title?: string
  allowPhone?: boolean
  allowMail?: boolean
  onSuccess?: (name: string, token: string, registration: boolean) => void
  initialCountryCode?: string
  Components?: ComponentTypes
  submitLabel?: string
}

export function Form({
  allowPhone = true,
  allowMail = true,
  onSuccess,
  initialCountryCode = 'us',
  style = {},
  variables = defaultVariables,
  submitLabel = 'Submit',
  Components = components,
}: Props) {
  const [tab, setTab] = useState('mail')
  const [mail, setMail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState(initialCountryCode.toLowerCase())
  const [mailValid, setMailValid] = useState(true)
  const [phoneValid, setPhoneValid] = useState(true)
  const multipleInputs = allowMail && allowPhone
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registration, setRegistration] = useState(false)
  const [error, setError] = useState('')
  const [codeValid, setCodeValid] = useState(true)

  Components = { ...components, ...Components }
  variables = { ...defaultVariables, ...variables }

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault()
      setError('')
      let name

      if (tab === 'mail' && allowMail && mail) {
        const mailValid = validateEmail(mail)
        setMailValid(mailValid)
        if (!mailValid) {
          return
        }
        name = mail
      }

      if (tab === 'phone' && allowPhone && phone) {
        const removeLeadingZeros = String(Number(phone))
        const fullPhone = getNumberCountryPrefix(countryCode) + removeLeadingZeros

        const phoneValid = validatePhone(fullPhone)
        setPhoneValid(phoneValid)
        if (!phoneValid) {
          return
        }
        name = fullPhone
      }

      setLoading(true)

      const { codeToken, error, registration: localRegistration } = await authenticate(name)

      if (codeToken) {
        Store.codeToken = codeToken
        Store.name = name
      }

      setLoading(false)

      if (error) {
        setError(error === true ? 'An unknown error occurred.' : error)
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
        const { error, token } = await confirm(code)

        if (error) {
          setCodeValid(false)
          return
        }

        if (token) {
          Store.token = token
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
      const { error, token } = await poll()

      if (error) {
        return
      }

      if (token) {
        Store.token = token
        if (onSuccess) {
          if (app.pollInterval) {
            clearInterval(app.pollInterval)
            app.pollInterval = 0
          }
          onSuccess(Store.name, token, registration)
        }
      }
    }

    if (submitted) {
      app.pollInterval = setInterval(() => {
        checkVerified()
      }, app.pollDuration)
    } else if (app.pollInterval) {
      clearInterval(app.pollInterval)
      app.pollInterval = 0
    }
  }, [submitted, registration])

  return (
    <Components.Form aria-label={Label.form} onSubmit={handleSubmit} style={style.form}>
      {!submitted && (
        <>
          {multipleInputs && (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Components.Tab
                aria-label={Label.tabMail}
                active={tab === 'mail'}
                onClick={() => setTab('mail')}
                variables={variables}
                style={style.tab}
              >
                Mail
              </Components.Tab>
              <Components.Tab
                aria-label={Label.tabPhone}
                active={tab === 'phone'}
                onClick={() => setTab('phone')}
                variables={variables}
                style={style.tab}
              >
                Phone
              </Components.Tab>
            </div>
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
              style={style}
              phoneValid={phoneValid}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phone={phone}
              setPhone={setPhone}
            />
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Components.Button
            aria-label={Label.submit}
            // @ts-ignore NOTE form submit not working with testing-library.
            onClick={handleSubmit}
            type="submit"
            style={style.button}
            variables={variables}
          >
            {loading ? 'Loading...' : submitLabel}
          </Components.Button>
        </>
      )}
      {submitted && (
        <>
          {registration && <p>A new account was created for you.</p>}
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
        </>
      )}
    </Components.Form>
  )
}
