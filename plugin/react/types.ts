import {
  FunctionComponent,
  CSSProperties,
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
} from 'react'
import { Variables, Configuration, Labels } from 'iltio'

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
  Form?: FunctionComponent<
    (FormProps & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>) | any
  >
  TabWrapper?: FunctionComponent<TabWrapperProps & any>
  Tab?: FunctionComponent<
    (TabProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) | any
  >
  Input?: FunctionComponent<
    (InputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) | any
  >
  Button?: FunctionComponent<
    | (ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>)
    | any
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
  configuration?: Configuration
  variables?: Variables
  style?: Styles
  allowPhone?: boolean
  allowMail?: boolean
  onSuccess?: (name: string, token: string, registration: boolean) => void
  initialCountryCode?: string
  Components?: ComponentTypes
  labels?: Labels
  isReactNative?: boolean
}

export type Styles = {
  form?: CSSProperties
  tabWrapper?: CSSProperties
  tab?: CSSProperties
  inputMail?: CSSProperties
  inputCode?: CSSProperties
  button?: CSSProperties
  error?: CSSProperties
  message?: CSSProperties
  phoneWrapper?: CSSProperties
  phoneTop?: CSSProperties
  phoneCountry?: { button?: CSSProperties; flag?: CSSProperties; prefix?: CSSProperties }
  phoneInput?: CSSProperties
  phoneCountryOptions?: CSSProperties
  phoneCountryOption?: { button?: CSSProperties; text?: CSSProperties }
  phoneInputCountrySearch?: CSSProperties
}
