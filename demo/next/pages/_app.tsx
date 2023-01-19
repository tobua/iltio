import { useState } from 'react'
import Head from 'next/head'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { authorize } from 'iltio'
import styles from '@/styles/app.module.css'

const inter = Inter({ subsets: ['latin'] })

function Actions() {
  const [count, setCount] = useState('?')
  const [user, setUser] = useState({ id: null, name: null, error: false })

  return (
    <>
      <button
        className={styles.button}
        onClick={async () => setUser(await authorize())}
      >
        Authorize
      </button>
      {user.id && (
        <p>
          ID: {user.id} Name: {user.name}
        </p>
      )}
      {user.error && <p>Not authorized</p>}
      <button
        className={styles.button}
        onClick={async () => {
          const { error, count } = await (await fetch('/api/counter')).json()
          setCount(error ? 'Error' : count ?? '?')
        }}
      >
        Authorized Counter Route
      </button>
      <p>Count: {count}</p>
      <hr className={styles.separator} />
      <div style={{ display: 'flex', justifySelf: 'flex-end', gap: 20 }}>
        <a className={styles.link} href="https://iltio.com/getting-started">
          Documentation
        </a>
        <a className={styles.link} href="https://github.com/tobua/iltio">
          GitHub
        </a>
      </div>
    </>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>iltio Next.JS Demo</title>
        <meta
          name="description"
          content="Demoes authentication with iltio featuring an interface proxy and first-party cookie."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div className={`${inter.className} ${styles.center}`}>
          <h1>iltio Next.js Demo</h1>
          <Component {...pageProps} />
          <hr className={styles.separator} />
          <Actions />
        </div>
      </main>
    </>
  )
}
