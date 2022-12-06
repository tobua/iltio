import { CSSProperties } from 'react'

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
}

export type Labels = {
  submit?: string
  tabPhone?: string
  tabMail?: string
  resend?: string
}
