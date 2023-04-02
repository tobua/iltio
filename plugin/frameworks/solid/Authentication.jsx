import { createSignal, createEffect, createMemo } from 'solid-js'
import { Label, defaultVariables, defaultLabels, Store, configure, app } from 'iltio'

const components = {
  Form: ({ style, children, variables, ...props }) => (
    <form
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: variables.space,
        ...style,
      }}
      {...props}
    >
      {children}
    </form>
  ),
  TabWrapper: ({ style, variables, ...props }) => (
    <div
      style={{ display: 'flex', justifyContent: 'space-around', gap: variables.space, ...style }}
      {...props}
    />
  ),
  Tab: ({ style, variables, active, children, ...props }) => (
    <button
      type="button"
      style={{
        cursor: 'pointer',
        color: variables.color,
        background: 'none',
        border: 'none',
        outline: 'none',
        padding: 0,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        ...(active && { fontWeight: 'bold' }),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  ),
  Button: ({ variables, children, style, ...props }) => (
    <button
      type="submit"
      style={{
        backgroundColor: variables.color,
        border: 'none',
        color: variables.contrast,
        padding: variables.smallSpace,
        cursor: 'pointer',
        borderRadius: variables.borderRadius,
        fontSize: variables.fontSize,
        fontFamily: variables.fontFamily,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  ),
}

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
}) {
  const [tab, setTab] = createSignal(allowMail ? 'mail' : 'phone')
  const [mail, setMail] = createSignal('')
  const [phone, setPhone] = createSignal('')
  const [countryCode, setCountryCode] = createSignal(initialCountryCode.toLowerCase())
  const [mailValid, setMailValid] = createSignal(true)
  const [phoneValid, setPhoneValid] = createSignal(true)
  const multipleInputs = allowMail && allowPhone
  const [loading, setLoading] = createSignal(false)
  const [submitted, setSubmitted] = createSignal(Store.codeToken !== '')
  const [registration, setRegistration] = createSignal(false)
  const [error, setError] = createSignal('')
  const [codeValid, setCodeValid] = createSignal(true)

  Components = { ...components, ...Components }
  variables = { ...defaultVariables, ...variables }
  labels = { ...defaultLabels, ...labels }
  style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    let name

    if (tab() === 'mail' && allowMail) {
      const currentMailValid = validateEmail(mail())
      setMailValid(currentMailValid)
      if (!currentMailValid) {
        setError('Please enter a valid mail address.')
        return
      }
      name = mail()
    }

    if (tab() === 'phone' && allowPhone) {
      const removeLeadingZeros = String(Number(phone()))
      const fullPhone = getNumberCountryPrefix(countryCode()) + removeLeadingZeros
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
  }

  const handleCode = async (code) => {
    if (code.length === 4) {
      setError('')
      const { error: localError, token: userToken } = await confirm(code)

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
  }

  createEffect(() => {
    async function checkVerified() {
      const { error: localError, token: userToken } = await poll()

      if (localError) {
        if (localError === 'Code expired.') {
          Store.removeCodeToken()
          setSubmitted(false)
          setError('Code expired, please try again.')
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

    if (submitted()) {
      app.pollInterval = setInterval(checkVerified, app.pollDuration)
    } else if (app.pollInterval) {
      clearInterval(app.pollInterval)
      app.pollInterval = 0
    }
  })

  return (
    <Components.Form
      aria-label={Label.form}
      onSubmit={handleSubmit}
      style={style.form}
      variables={variables}
    >
      <Show when={!submitted() && multipleInputs}>
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
      </Show>
      <p>{tab()}</p>
    </Components.Form>
  )
}
