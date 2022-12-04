interface BasicStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

export const MemoryStorage = {
  data: {},
  getItem: (key: string) => MemoryStorage.data[key],
  setItem: (key: string, value: any) => {
    MemoryStorage.data[key] = value
  },
  removeItem: (key: string) => {
    delete MemoryStorage.data[key]
  },
}

function getInitialStorage() {
  if (typeof window === 'undefined') {
    return undefined
  }

  try {
    window.sessionStorage.getItem('non-existent')
  } catch (error) {
    // Access to sessionStorage blocked by browser, which is the case in Codesandbox iframe.
    return MemoryStorage as BasicStorage
  }

  return window.sessionStorage as BasicStorage
}

export const app = {
  apiUrl: 'https://iltio.com/api',
  authenticateUrl: '',
  apiToken: '',
  tokenStorageKey: 'auth-token',
  codeTokenStorageKey: 'auth-verify-token',
  nameStorageKey: 'auth-name',
  storage: getInitialStorage(),
  pollDuration: 10000,
  pollInterval: null,
}

export const configure = ({
  url,
  token,
  ...options
}: {
  url?: string
  token: string
  storage?: BasicStorage
  authenticateUrl?: string
  tokenStorageKey?: string
  codeTokenStorageKey?: string
  nameStorageKey?: string
  pollDuration?: number
}) => Object.assign(app, { ...options, apiUrl: url || app.apiUrl, apiToken: token || app.apiToken })

export const Store = {
  get token() {
    return app.storage.getItem(app.tokenStorageKey) ?? ''
  },
  set token(value: string) {
    app.storage.setItem(app.tokenStorageKey, value)
  },
  removeToken() {
    app.storage.removeItem(app.tokenStorageKey)
  },
  get codeToken() {
    return app.storage.getItem(app.codeTokenStorageKey) ?? ''
  },
  set codeToken(value: string) {
    app.storage.setItem(app.codeTokenStorageKey, value)
  },
  removeCodeToken() {
    app.storage.removeItem(app.codeTokenStorageKey)
  },
  get name() {
    return app.storage.getItem(app.nameStorageKey) ?? ''
  },
  set name(value: string) {
    app.storage.setItem(app.nameStorageKey, value)
  },
  removeName() {
    app.storage.removeItem(app.nameStorageKey)
  },
}
