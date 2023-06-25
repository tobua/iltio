import urlJoin from 'url-join'
import { app, Store } from './store'
import { countries } from './data/countries'
import { poll } from './route'
import { Variables } from './types'

export const validateEmail = (value: string) =>
  // eslint-disable-next-line no-control-regex
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
    value
  )

export const validatePhone = (value: string) =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)

export const getNameType = (value: string) => {
  if (validateEmail(value)) {
    return 'mail'
  }

  if (validatePhone(value)) {
    return 'phone'
  }

  return false
}

export const defaultLabels = {
  submit: 'Submit',
  tabPhone: 'Phone',
  tabMail: 'Mail',
  resend: 'Resend Code',
}

export const defaultVariables: Variables = {
  color: 'black',
  colorError: 'red',
  contrast: 'white',
  borderRadius: 0,
  smallSpace: 10,
  space: 20,
  fontSize: 16,
  fontFamily: 'inherit',
}

export const joinUrl = (path: string, base = app.apiUrl) => urlJoin(base, path)

// Search for countries that match the filter.
export const filterCountries = (filter: string) => {
  if (!filter) {
    return countries
  }

  const result = {}

  Object.values(countries).forEach((country) => {
    if (country.name.toLowerCase().includes(filter.toLowerCase())) {
      result[country.abbreviation] = country
    }
  })

  return result as typeof countries
}

export const initializePolling = (
  successCallback: Function,
  expiredCallback: Function,
  registration: boolean
) => {
  const submitted = Store.codeToken !== ''

  async function checkVerified() {
    const { error: localError, token: userToken } = await poll()

    if (localError) {
      // Code token expired, start over.
      if (localError === 'Code expired.') {
        Store.removeCodeToken()
        expiredCallback()
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

      if (successCallback) {
        successCallback(Store.name, userToken, registration)
      }
    }
  }

  // Continue polling after page reload in verification stage.
  if (submitted) {
    // Avoid registering multiple listeners.
    if (!app.pollInterval) {
      app.pollInterval = setInterval(checkVerified, app.pollDuration)
    }
    checkVerified()
  } else {
    stopPolling()
  }
}

export const stopPolling = () => {
  if (app.pollInterval) {
    clearInterval(app.pollInterval)
    app.pollInterval = 0
  }
}
