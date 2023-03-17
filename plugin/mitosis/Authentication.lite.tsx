import { useState } from '@builder.io/mitosis'

const Label = {
  form: 'authentication-form',
  title: 'authentication-title',
  tabMail: 'authentication-tab-mail',
  tabPhone: 'authentication-tab-phone',
  inputMail: 'authentication-input-mail',
  inputPhone: 'authentication-input-phone',
  submit: 'authentication-submit',
  inputNumber: 'authentication-input-number',
  phoneCountry: 'authentication-phone-country',
  resendCode: 'authentication-resend-code',
  registration: 'authentication-registration',
  phoneInputCountrySearch: 'authentication-phone-input-country-search',
  phoneCountryOption: 'authentication-phone-country-option',
}

interface Configuration {
  url?: string
  token?: string
  storage?: any
  authenticateUrl?: string
  tokenStorageKey?: string
  codeTokenStorageKey?: string
  nameStorageKey?: string
  pollDuration?: number
}

type Labels = {
  submit?: string
  tabPhone?: string
  tabMail?: string
  resend?: string
}

interface Props {
  configuration?: Configuration
  variables?: any
  style?: any
  allowPhone?: boolean
  allowMail?: boolean
  onSuccess?: (name: string, token: string, registration: boolean) => void
  initialCountryCode?: string
  Components?: any
  labels?: Labels
}

export default function Authentication(props: Props) {
  const [tab, setTab] = useState(props.allowMail ? 'mail' : 'phone')
  const [mail, setMail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState(props.initialCountryCode || 'ch')
  const [mailValid, setMailValid] = useState(true)
  const [phoneValid, setPhoneValid] = useState(true)
  const multipleInputs = props.allowMail && props.allowPhone
  const [loading, setLoading] = useState(false)
  // const [submitted, setSubmitted] = useState(Store.codeToken !== '')
  const [registration, setRegistration] = useState(false)
  const [error, setError] = useState('')
  const [codeValid, setCodeValid] = useState(true)

  // eslint-disable-next-line no-param-reassign
  props.Components = null // { ...components, ...Components }
  // eslint-disable-next-line no-param-reassign
  props.variables = { ...{}, ...props.variables }
  // eslint-disable-next-line no-param-reassign
  props.labels = { ...{}, ...props.labels }
  // eslint-disable-next-line no-param-reassign
  props.style = { phoneCountry: {}, phoneCountryOption: {}, ...props.style }

  return (
    <form aria-label={Label.form} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px' }}>
        <button
          type="button"
          aria-label="authentication-tab-mail"
          onClick={() => setTab('mail')}
          style={{
            cursor: 'pointer',
            color: 'black',
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: '0px',
            fontSize: '16px',
            fontFamily: 'inherit',
            fontWeight: tab === 'mail' ? 'bold' : 'auto',
          }}
        >
          Mail
        </button>
        <button
          type="button"
          aria-label="authentication-tab-phone"
          onClick={() => setTab('phone')}
          style={{
            cursor: 'pointer',
            color: 'black',
            background: 'none',
            border: 'none',
            outline: 'none',
            padding: '0px',
            fontSize: '16px',
            fontFamily: 'inherit',
            fontWeight: tab === 'phone' ? 'bold' : 'auto',
          }}
        >
          Phone
        </button>
      </div>
      <p>
        Hello <span>{tab}</span>!
      </p>
    </form>
  )
}
