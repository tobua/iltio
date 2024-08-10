import { parse } from 'cookie'
import { BasicStorage, Configuration } from './types'

export const MemoryStorage = {
  data: {} as { [key: string]: string },
  getItem: (key: string) => MemoryStorage.data[key],
  setItem: (key: string, value: any) => {
    MemoryStorage.data[key] = value
  },
  removeItem: (key: string) => {
    delete MemoryStorage.data[key]
  },
}

export const CookieStorage = {
  getItem: (key: string) => {
    if (typeof document !== 'undefined') {
      const cookies = parse(document.cookie)
      return cookies[key]
    }
    return null
  },
  // Ignoring as set and remove done on server.
  setItem: () => null,
  removeItem: () => null,
}

function getInitialStorage() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    return MemoryStorage as BasicStorage
  }

  // Use sessionStorage in development to avoid sharing logins between different applications running on localhost:3000.
  const defaultStorage =
    process.env.NODE_ENV === 'production' ? window.localStorage : window.sessionStorage

  try {
    defaultStorage.getItem('non-existent')
  } catch (error) {
    // Access to sessionStorage (or localStorage) blocked by browser, which is the case in Codesandbox iframe.
    return MemoryStorage as BasicStorage
  }

  return defaultStorage as BasicStorage
}

const getInitialConfiguration = () => ({
  apiUrl: 'https://iltio.com/api',
  authenticateUrl: '',
  apiToken: '',
  tokenStorageKey: 'auth-token',
  codeTokenStorageKey: 'auth-verify-token',
  nameStorageKey: 'auth-name',
  uidStorageKey: 'auth-uid',
  jsonWebTokenKey: 'auth-jwt',
  storage: getInitialStorage(),
  pollDuration: 10000,
  pollInterval: null,
  encryptionKeyStorageKey: 'client-side-encryption-key',
})

export const app = getInitialConfiguration()

export const configure = ({ url, token, ...options }: Configuration) =>
  Object.assign(app, { ...options, apiUrl: url || app.apiUrl, apiToken: token || app.apiToken })

export const reset = () => {
  Object.assign(app, getInitialConfiguration())
}

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
  get jsonWebToken() {
    return app.storage.getItem(app.codeTokenStorageKey) ?? ''
  },
  set jsonWebToken(value: string) {
    app.storage.setItem(app.jsonWebTokenKey, value)
  },
  removeJsonWebToken() {
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
  get encryptionKey() {
    return app.storage.getItem(app.encryptionKeyStorageKey) ?? ''
  },
  set encryptionKey(value: string) {
    app.storage.setItem(app.encryptionKeyStorageKey, value)
  },
  removeEncryptionKey() {
    app.storage.removeItem(app.encryptionKeyStorageKey)
  },
  get uid() {
    return app.storage.getItem(app.uidStorageKey) ?? ''
  },
  set uid(value: string) {
    app.storage.setItem(app.uidStorageKey, value)
  },
  removeUid() {
    app.storage.removeItem(app.uidStorageKey)
  },
}
