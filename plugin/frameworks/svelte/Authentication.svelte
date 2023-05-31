<script>
  import { onMount } from 'svelte'
  import {
    Label,
    Text,
    defaultVariables,
    defaultLabels,
    Store,
    configure,
    validateEmail,
    validatePhone,
    authenticate,
    countries,
    initializePolling,
    confirm,
    app,
  } from 'iltio'
  import Phone from './Phone.svelte'
  import Tabs from './Tabs.svelte'
  import Code from './Code.svelte'
  import Tab from './components/Tab.svelte'
  import TabWrapper from './components/TabWrapper.svelte'
  import Input from './components/Input.svelte'
  import Button from './components/Button.svelte'
  import Form from './components/Form.svelte'
  import Message from './components/Message.svelte'
  import Error from './components/Error.svelte'
  import PhoneCountry from './components/PhoneCountry.svelte'
  import PhoneCountryOptions from './components/PhoneCountryOptions.svelte'
  import PhoneCountryOption from './components/PhoneCountryOption.svelte'
  import PhoneInput from './components/PhoneInput.svelte'
  import PhoneTop from './components/PhoneTop.svelte'
  import PhoneWrapper from './components/PhoneWrapper.svelte'

  export let allowPhone = true
  export let allowMail = true
  export let initialCountryCode = 'us'
  export let style = { phoneCountry: {}, phoneCountryOption: {} }
  export let variables = {}
  export let labels = {}
  export let configuration = {}
  export let onSuccess

  variables = { ...defaultVariables, ...variables }
  labels = { ...defaultLabels, ...labels }
  style = { phoneCountry: {}, phoneCountryOption: {}, ...style }

  let tab = allowMail ? 'mail' : 'phone'
  let mail = ''
  let phone = ''
  let countryCode = initialCountryCode.toLowerCase()
  let mailValid = true
  let phoneValid = true
  const multipleInputs = allowMail && allowPhone
  let loading = false
  let submitted = Store.codeToken !== ''
  let registration = false
  let error = ''
  let codeValid = true
  let Components = {
    TabWrapper,
    Tab,
    Input,
    Button,
    Form,
    Message,
    Error,
    PhoneCountry,
    PhoneCountryOptions,
    PhoneCountryOption,
    PhoneInput,
    PhoneTop,
    PhoneWrapper,
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    error = ''
    let name

    if (tab === 'mail' && allowMail) {
      const currentMailValid = validateEmail(mail)
      mailValid = currentMailValid
      if (!currentMailValid) {
        error = Text.InvalidMailError
        return
      }
      name = mail
    }

    if (tab === 'phone' && allowPhone) {
      const removeLeadingZeros = String(Number(phone))
      const fullPhone = countries[countryCode].prefix + removeLeadingZeros
      const currentPhoneValid = validatePhone(fullPhone)
      phoneValid = currentPhoneValid
      if (!currentPhoneValid) {
        error = Text.InvalidPhoneNumberError
        return
      }
      name = fullPhone
    }

    loading = true

    const {
      codeToken,
      error: localError,
      registration: localRegistration,
    } = await authenticate(name)

    if (codeToken) {
      Store.codeToken = codeToken
      Store.name = name
    }

    loading = false

    if (localError) {
      error = localError === true ? Text.UnknownError : localError
      return
    }

    registration = localRegistration
    submitted = true

    initializePolling(
      onSuccess,
      () => {
        submitted = false
        error = Text.CodeExpiredError
      },
      registration
    )
  }

  const handleCode = async (code) => {
    if (code.length === 4) {
      error = ''
      const { error: localError, token: userToken } = await confirm(code)

      if (localError) {
        if (localError === 'Code invalid or expired.') {
          Store.removeCodeToken()
          submitted = false
          error = Text.CodeExpiredError
        }

        if (localError === 'Wrong code entered.') {
          codeValid = false
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
      codeValid = true
    }
  }

  const setTab = (newTab) => {
    tab = newTab
  }

  const setCountryCode = (value) => {
    countryCode = value
  }

  const setPhone = (value) => {
    phone = value
  }

  const setMail = (value) => {
    mail = value
  }

  onMount(() => {
    initializePolling(
      onSuccess,
      () => {
        submitted = false
        error = Text.CodeExpiredError
      },
      registration
    )

    if (configuration) {
      configure(configuration)
    }
  })
</script>

<Components.Form aria-label={Label.form} on:submit={handleSubmit} style={style.form} {variables}>
  {#if !submitted}
    <Tabs {multipleInputs} {tab} {setTab} {style} {labels} {variables} {Components} />
    {#if allowMail && (!multipleInputs || tab === 'mail')}
      <Components.Input
        aria-label={Label.inputMail}
        aria-invalid={!mailValid}
        bind:value={mail}
        on:input={(event) => setMail(event.target.value)}
        required
        valid={mailValid}
        style={style.inputMail}
        placeholder={Text.MailInputPlaceholder}
        type="email"
        {variables}
      />
    {/if}
    {#if allowPhone && (!multipleInputs || tab === 'phone')}
      <Phone
        {countryCode}
        {setCountryCode}
        {phone}
        {setPhone}
        {variables}
        {phoneValid}
        {Components}
        {style}
      />
    {/if}
    {#if error}
      <Components.Error style={style.error} {variables} aria-label={Label.inputError}>
        {error}
      </Components.Error>
    {/if}
    <Components.Button
      aria-label={Label.submit}
      on:click={handleSubmit}
      type="submit"
      {variables}
      style={style.button}
    >
      {loading ? Text.LoadingButton : labels.submit}
    </Components.Button>
  {/if}
  {#if submitted}
    <Code {style} {variables} {labels} {registration} {codeValid} {Components} {handleCode} />
  {/if}
</Components.Form>
