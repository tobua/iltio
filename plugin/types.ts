export interface Variables {
  color?: string
  contrast?: string
  borderRadius?: number | string
  smallSpace?: number | string
  space?: number | string
  fontSize?: number | string
  fontFamily?: string
}

export type Labels = {
  submit?: string
  tabPhone?: string
  tabMail?: string
  resend?: string
}

export interface BasicStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export interface Configuration {
  url?: string
  token?: string
  storage?: BasicStorage
  authenticateUrl?: string
  tokenStorageKey?: string
  codeTokenStorageKey?: string
  nameStorageKey?: string
  pollDuration?: number
}
