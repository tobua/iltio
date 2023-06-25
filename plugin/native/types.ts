import { CSSProperties } from 'react'
import { Variables } from 'iltio'

export type NativeStyles = {
  form?: CSSProperties
  tabWrapper?: CSSProperties
  tab?: { touchable?: CSSProperties; text?: CSSProperties }
  inputMail?: { view?: CSSProperties; input?: CSSProperties }
  inputCode?: { view?: CSSProperties; input?: CSSProperties }
  button?: { touchable?: CSSProperties; text?: CSSProperties }
  error?: CSSProperties
  message?: CSSProperties
  phoneWrapper?: CSSProperties
  phoneTop?: CSSProperties
  phoneCountry?: { touchable?: CSSProperties; flag?: CSSProperties; prefix?: CSSProperties }
  phoneInput?: CSSProperties
  phoneCountryOptions?: { wrapper?: CSSProperties; content?: CSSProperties }
  phoneCountryOption?: { touchable?: CSSProperties; text?: CSSProperties }
  phoneInputCountrySearch?: { view?: CSSProperties; input?: CSSProperties }
}

export interface NativeVariables extends Variables {
  borderRadius?: number
  space?: number
  smallSpace?: number
}
