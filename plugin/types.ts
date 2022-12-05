import { CSSProperties } from 'react'

export type Variables = {
  color?: string
  contrast?: string
  borderRadius?: number
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
}

export type Labels = {
  submit?: string
  tabPhone?: string
  tabMail?: string
  resend?: string
}
