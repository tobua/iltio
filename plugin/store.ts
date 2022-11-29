interface BasicStorage {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

const MemoryStorage = {
  data: {},
  getItem: (key) => MemoryStorage.data[key],
  setItem: (key, value) => {
    MemoryStorage.data[key] = value
  },
  removeItem: (key) => {
    delete MemoryStorage.data[key]
  },
}

function getInitialStorage() {
  if (typeof window === 'undefined') {
    return
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
  storageKey: 'auth-token',
  codeTokenStorageKey: 'auth-verify-token',
  nameStorageKey: 'auth-name',
  storage: getInitialStorage(),
  pollInterval: null,
}

export const configure = ({
  url,
  token,
  storage,
  authenticateUrl,
}: {
  url?: string
  token?: string
  storage?: BasicStorage
  authenticateUrl?: string
}) => {
  if (url) {
    app.apiUrl = url
  }

  if (token) {
    app.apiToken = token
  }

  if (storage) {
    app.storage = storage
  }

  if (authenticateUrl) {
    app.authenticateUrl
  }
}

export const Store = {
  get token() {
    return app.storage.getItem(app.storageKey) ?? ''
  },
  set token(value: string) {
    app.storage.setItem(app.storageKey, value)
  },
  removeToken() {
    app.storage.removeItem(app.storageKey)
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
