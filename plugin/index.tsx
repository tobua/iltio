import React, {
  CSSProperties,
  FormEventHandler,
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { Label } from './label'
import { Phone, getNumberCountryPrefix } from './phone/Phone'
import { Components } from './components'

// TODO eslint doesn't seem to be working in this setup, adding root=true will lead to another import error of tsconfig after editor reload.

interface BasicStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const app = {
  apiUrl: 'https://iltio.com/api',
  authenticateUrl: '',
  apiToken: '',
  storageKey: 'auth-token',
  codeTokenStorageKey: 'auth-verify-token',
  nameStorageKey: 'auth-name',
  storage: typeof window !== 'undefined' && (window.sessionStorage as BasicStorage),
  pollInterval: null,
}

export const configure = ({
  url,
  token,
  storage,
  authenticateUrl,
}: {
  url?: string
  token?: string
  storage?: BasicStorage
  authenticateUrl?: string
}) => {
  if (url) {
    app.apiUrl = url
  }

  if (token) {
    app.apiToken = token
  }

  if (storage) {
    app.storage = storage
  }

  if (authenticateUrl) {
    app.authenticateUrl
  }
}

export const Store = {
  get token() {
    return app.storage.getItem(app.storageKey) ?? ''
  },
  set token(value: string) {
    app.storage.setItem(app.storageKey, value)
  },
  removeToken() {
    app.storage.removeItem(app.storageKey)
  },
  get codeToken() {
    return app.storage.getItem(app.codeTokenStorageKey) ?? ''
  },
  set codeToken(value: string) {
    app.storage.setItem(app.codeTokenStorageKey, value)
  },
  removeCodeToken() {
    app.storage.removeItem(app.codeTokenStorageKey)
  },
  get name() {
    return app.storage.getItem(app.nameStorageKey) ?? ''
  },
  set name(value: string) {
    app.storage.setItem(app.nameStorageKey, value)
  },
  removeName() {
    app.storage.removeItem(app.nameStorageKey)
  },
}

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
  const { name, error } = await response.json()

  return { name, error }
}

export const logout = () => {
  Store.removeToken()
}

export const remove = async (token = Store.token) => {
  if (!token) {
    return console.error('No user logged in or token provided.')
  }

  const response = await fetch(`${app.apiUrl}/delete?token=${token}`)
  const { error } = await response.json()

  return { error }
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

const validateEmail = (value: string) => {
  return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    value
  )
}

const validatePhone = (value: string) => {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value)
}

const defaultVariables = { color: 'black', contrast: 'white', borderRadius: 0 }

type Variables = {
  color?: string
  contrast?: string
  borderRadius?: number
}

type Styles = {
  form?: CSSProperties
  inputMail?: CSSProperties
  button?: CSSProperties
}

type Components = {
  input?: FunctionComponent<{ valid: boolean; style?: CSSProperties; variables?: Variables }>
  button?: FunctionComponent<{ children: string; style?: CSSProperties; variables?: Variables }>
  form?: FunctionComponent<{ style?: CSSProperties; children: JSX.Element | JSX.Element[] }>
}

interface Props {
  theme?: string
  variables?: Variables
  style?: Styles
  title?: string
  allowPhone?: boolean
  allowMail?: boolean
  onSuccess?: (name: string, token: string, registration: boolean) => void
  initialCountryCode?: string
  components?: Components
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
  components = Components,
}: Props) {
  const [tab, setTab] = useState('mail')
  const [mail, setMail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState(initialCountryCode)
  const [mailValid, setMailValid] = useState(true)
  const [phoneValid, setPhoneValid] = useState(true)
  const multipleInputs = allowMail && allowPhone
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registration, setRegistration] = useState(false)
  const [error, setError] = useState('')
  const [codeValid, setCodeValid] = useState(true)
  const Button = components.button ?? 'button'
  const Input = components.input ?? 'input'
  const Form = components.form ?? 'form'

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

      const { codeToken, error, registration } = await authenticate(name)

      if (codeToken) {
        Store.codeToken = codeToken
        Store.name = name
      }

      setLoading(false)

      if (error) {
        setError(error === true ? 'An unknown error occurred.' : error)
        return
      }

      setRegistration(registration)
      setSubmitted(true)
    },
    [mail, phone, allowMail, allowPhone, tab]
  )

  const handleCode = useCallback(async (code: string) => {
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
  }, [])

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
      }, 10000)
    } else if (app.pollInterval) {
      clearInterval(app.pollInterval)
      app.pollInterval = 0
    }
  }, [submitted, registration])

  return (
    <Form aria-label={Label.form} onSubmit={handleSubmit}>
      {!submitted && (
        <>
          {multipleInputs && (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <span
                aria-label={Label.tabMail}
                style={{
                  cursor: 'pointer',
                  color: variables.color,
                  ...(tab === 'mail' && { fontWeight: 'bold' }),
                }}
                onClick={() => setTab('mail')}
              >
                Mail
              </span>
              <span
                aria-label={Label.tabPhone}
                style={{
                  cursor: 'pointer',
                  color: variables.color,
                  ...(tab === 'phone' && { fontWeight: 'bold' }),
                }}
                onClick={() => setTab('phone')}
              >
                Phone
              </span>
            </div>
          )}
          {allowMail && (!multipleInputs || tab === 'mail') && (
            <Input
              aria-label={Label.inputMail}
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
          <Button
            aria-label={Label.submit}
            // @ts-ignore NOTE form submit not working with testing-library.
            onClick={handleSubmit}
            type="submit"
            style={style.button}
            variables={variables}
          >
            {loading ? 'Loading...' : submitLabel}
          </Button>
        </>
      )}
      {submitted && (
        <>
          {registration && <p>A new account was created for you.</p>}
          <Input
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
    </Form>
  )
}
