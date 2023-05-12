import { createSignal, createEffect, createMemo, splitProps } from 'solid-js'
import {
  Label,
  defaultVariables,
  defaultLabels,
  Store,
  configure,
  app,
  validateEmail,
  validatePhone,
  authenticate,
  poll,
  confirm,
  countries,
} from 'iltio'
import { Phone } from './Phone'

const toPx = (value) => `${value}px`

const components = {
  Form: (props) => {
    // NOTE regular object destructuring doesn't work in SolidJS.
    const [local, others] = splitProps(props, ['style', 'children', 'variables'])

    return (
      <form
        style={{
          display: 'flex',
          'flex-direction': 'column',
          gap: toPx(local.variables.space),
          ...local.style,
        }}
        {...others}
      >
        {local.children}
      </form>
    )
  },
  TabWrapper: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables'])

    return (
      <div
        style={{
          display: 'flex',
          'justify-content': 'space-around',
          gap: toPx(local.variables.space),
          ...local.style,
        }}
        {...others}
      />
    )
  },
  Tab: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables', 'active', 'children'])

    return (
      <button
        type="button"
        style={{
          cursor: 'pointer',
          color: local.variables.color,
          background: 'none',
          border: 'none',
          outline: 'none',
          padding: 0,
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          ...(local.active() && { 'font-weight': 'bold' }),
          ...local.style,
        }}
        {...others}
      >
        {local.children}
      </button>
    )
  },
  Button: (props) => {
    const [local, others] = splitProps(props, ['style', 'children', 'variables'])

    return (
      <button
        type="submit"
        style={{
          background: local.variables.color,
          border: 'none',
          color: local.variables.contrast,
          padding: toPx(local.variables.smallSpace),
          cursor: 'pointer',
          'border-radius': toPx(local.variables.borderRadius),
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          ...local.style,
        }}
        {...others}
      >
        {local.children()}
      </button>
    )
  },
  Input: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables', 'valid'])

    return (
      <input
        style={{
          'border-width': '1px',
          'border-style': 'solid',
          'border-color': !local.valid || local.valid() ? local.variables.color : 'red',
          padding: toPx(9),
          outline: 'none',
          'border-radius': toPx(local.variables.borderRadius),
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          'background-color': 'inherit',
          ...local.style,
        }}
        {...others}
      />
    )
  },
  Error: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables', 'children'])

    return (
      <p
        style={{
          color: 'red',
          margin: 0,
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          ...local.style,
        }}
        {...others}
      >
        {local.children}
      </p>
    )
  },
  Message: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables', 'children'])

    return (
      <p
        style={{
          'background-color': 'lightgray',
          margin: 0,
          padding: toPx(local.variables.smallSpace),
          'border-radius': local.variables.borderRadius,
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          ...local.style,
        }}
        {...others}
      >
        {local.children}
      </p>
    )
  },
  PhoneWrapper: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables', 'valid'])

    return (
      <div
        style={{
          display: 'flex',
          'flex-direction': 'column',
          'border-width': toPx(1),
          'border-style': 'solid',
          'border-color': local.valid() ? local.variables.color : 'red',
          'border-radius': local.variables.borderRadius,
          'padding-left': toPx(local.variables.smallSpace),
          ...local.style,
        }}
        {...others}
      />
    )
  },
  PhoneTop: (props) => {
    const [local, others] = splitProps(props, ['style'])
    return <div style={{ display: 'flex', ...local.style }} {...others} />
  },
  PhoneCountry: (props) => {
    const [local, others] = splitProps(props, [
      'style',
      'variables',
      'prefix',
      'flag',
      'togglePicker',
    ])

    return (
      <button
        style={{
          display: 'flex',
          gap: toPx(local.variables.smallSpace),
          'align-items': 'center',
          border: 'none',
          background: 'none',
          outline: 'none',
          padding: 0,
          cursor: 'pointer',
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          ...local.style.button,
        }}
        type="button"
        onClick={local.togglePicker}
        {...others}
      >
        <span
          style={{
            fontSize: toPx(local.variables.fontSize),
            fontFamily: local.variables.fontFamily,
            ...local.style.flag,
          }}
        >
          {local.flag}
        </span>
        <span
          style={{
            fontSize: toPx(local.variables.fontSize),
            fontFamily: local.variables.fontFamily,
            ...local.style.prefix,
          }}
        >
          {local.prefix}
        </span>
      </button>
    )
  },
  PhoneInput: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables', 'valid'])

    return (
      <input
        style={{
          background: 'none',
          border: 'none',
          padding: toPx(9),
          outline: 'none',
          width: '100%',
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          // TODO has no border currently...
          'border-color': local.valid() ? local.variables.color : 'red',
          ...local.style,
        }}
        {...others}
      />
    )
  },
  PhoneCountryOptions: (props) => {
    const [local, others] = splitProps(props, ['style', 'variables'])

    return (
      <div
        style={{
          display: 'flex',
          'flex-direction': 'column',
          'max-height': 200,
          'overflow-y': 'auto',
          'overflow-x': 'hidden',
          'padding-right': toPx(local.variables.smallSpace),
          'padding-bottom': toPx(local.variables.smallSpace),
          'row-gap': toPx(5),
          ...local.style,
        }}
        {...others}
      />
    )
  },
  PhoneCountryOption: (props) => {
    const [local, others] = splitProps(props, [
      'style',
      'variables',
      'selected',
      'children',
      'onSelect',
    ])

    return (
      <button
        style={{
          'font-weight': local.selected() ? 'bold' : 'normal',
          margin: 0,
          padding: 0,
          'font-size': toPx(local.variables.fontSize),
          'font-family': local.variables.fontFamily,
          border: 'none',
          background: 'none',
          outline: 'none',
          display: 'flex',
          cursor: 'pointer',
          'max-width': '100%',
          ...local.style.button,
        }}
        onClick={local.onSelect}
        type="button"
        {...others}
      >
        <span
          style={{
            'white-space': 'nowrap',
            'text-overflow': 'ellipsis',
            overflow: 'hidden',
            ...local.style.text,
          }}
        >
          {local.children}
        </span>
      </button>
    )
  },
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
  Components = { ...components, ...Components }
  variables = { ...defaultVariables, ...variables }
  labels = { ...defaultLabels, ...labels }
  style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

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
  const isMailTab = createMemo(() => tab() === 'mail')
  const isPhoneTab = createMemo(() => tab() === 'phone')
  const submitLabel = createMemo(() => (loading() ? 'Loading...' : labels.submit))

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
      const fullPhone = countries[countryCode()].prefix + removeLeadingZeros
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
      <Show when={!submitted()}>
        <Show when={multipleInputs}>
          <Components.TabWrapper style={style.tabWrapper} variables={variables}>
            <Components.Tab
              aria-label={Label.tabMail}
              active={isMailTab}
              onClick={() => setTab('mail')}
              variables={variables}
              style={style.tab}
            >
              {labels.tabMail}
            </Components.Tab>
            <Components.Tab
              aria-label={Label.tabPhone}
              active={isPhoneTab}
              onClick={() => setTab('phone')}
              variables={variables}
              style={style.tab}
            >
              {labels.tabPhone}
            </Components.Tab>
          </Components.TabWrapper>
        </Show>
        <Show when={allowMail && (!multipleInputs || isMailTab())}>
          <Components.Input
            aria-label={Label.inputMail}
            aria-invalid={!mailValid}
            value={mail()}
            onInput={(event) => setMail(event.target.value)}
            required
            valid={mailValid}
            variables={variables}
            style={style.inputMail}
            placeholder="Mail"
            type="email"
          />
        </Show>
        <Show when={allowPhone && isPhoneTab()}>
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
        </Show>
        <Show when={error()}>
          <Components.Error style={style.error} variables={variables}>
            {error}
          </Components.Error>
        </Show>
        <Components.Button
          aria-label={Label.submit}
          onClick={handleSubmit}
          type="submit"
          style={style.button}
          variables={variables}
        >
          {submitLabel}
        </Components.Button>
      </Show>
      <Show when={submitted()}>
        <Show when={registration()}>
          <Components.Message
            aria-label={Label.registration}
            style={style.message}
            variables={variables}
          >
            A new account was created for you.
          </Components.Message>
        </Show>
        <Components.Message style={style.message} variables={variables}>
          Enter the code received in your mail below or confirm through the link.
        </Components.Message>
        <Components.Input
          aria-label={Label.inputNumber}
          onInput={(event) => handleCode(event.target.value)}
          valid={codeValid}
          required
          placeholder="Code"
          type="number"
          maxLength={4}
          style={{ textAlign: 'center', ...style.inputCode }}
          variables={variables}
        />
        {/* <Resend Components={Components} labels={labels} variables={variables} style={style} /> */}
      </Show>
    </Components.Form>
  )
}
