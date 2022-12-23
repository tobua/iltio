import {
  FunctionComponent,
  CSSProperties,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
} from 'react'

export type Variables = {
  color?: string
  contrast?: string
  borderRadius?: number | string
  smallSpace?: number | string
  space?: number | string
  fontSize?: number | string
  fontFamily?: string
}

export type Styles = {
  form?: CSSProperties
  inputMail?: CSSProperties
  button?: CSSProperties
  tabWrapper?: CSSProperties
  tab?: CSSProperties
  error?: CSSProperties
  message?: CSSProperties
  phoneWrapper?: CSSProperties
  phoneFlag?: CSSProperties
  phonePrefix?: CSSProperties
  phoneSelect?: CSSProperties
  phoneOption?: CSSProperties
  phoneInput?: CSSProperties
  phoneInputCountrySearch?: CSSProperties
  phoneTop?: CSSProperties
}

export type Labels = {
  submit?: string
  tabPhone?: string
  tabMail?: string
  resend?: string
}

export type InputProps = { valid: boolean; style: CSSProperties; variables: Variables }
export type ButtonProps = { children: string; style: CSSProperties; variables: Variables }
export type FormProps = {
  style: CSSProperties
  children: JSX.Element | JSX.Element[]
  variables: Variables
}
export type TabWrapperProps = { style: CSSProperties; variables: Variables }
export type TabProps = {
  style: CSSProperties
  variables: Variables
  active: boolean
  children: string
}
export type ErrorProps = { style: CSSProperties; variables: Variables; children: string }
export type MessageProps = { style: CSSProperties; variables: Variables; children: string }

export type ComponentTypes = {
  Input?: FunctionComponent<
    (InputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) | any
  >
  Button?: FunctionComponent<
    | (ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>)
    | any
  >
  Form?: FunctionComponent<
    (FormProps & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) | any
  >
  TabWrapper?: FunctionComponent<TabWrapperProps & any>
  Tab?: FunctionComponent<
    (TabProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) | any
  >
  Error?: FunctionComponent<ErrorProps & any>
  Message?: FunctionComponent<MessageProps & any>
  PhoneWrapper?: FunctionComponent<any>
  PhoneInput?: FunctionComponent<any>
  PhoneTop?: FunctionComponent<any>
  PhoneCountry?: FunctionComponent<any>
  PhoneCountryOptions?: FunctionComponent<any>
  PhoneCountryOption?: FunctionComponent<any>
}

export interface Props {
  variables?: Variables
  style?: Styles
  allowPhone?: boolean
  allowMail?: boolean
  onSuccess?: (name: string, token: string, registration: boolean) => void
  initialCountryCode?: string
  Components?: ComponentTypes
  labels?: Labels
}
