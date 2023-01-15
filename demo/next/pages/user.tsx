import { useState } from 'react'
import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { parse } from 'cookie'
import { getCookie } from 'cookies-next'
import { authorize, configure, logout, remove } from 'iltio'
import { GetServerSideProps } from 'next'

const inter = Inter({ subsets: ['latin'] })

configure({
  url: '/api/authentication',
  token: 'demo',
  storage: {
    getItem: (key: string) => {
      if (typeof document !== 'undefined') {
        const cookies = parse(document.cookie)
        return cookies[key]
      }
      return null
    },
    // Set done on server.
    setItem: () => undefined,
    removeItem: () => undefined,
  },
})

type Data = { authenticated: boolean; name: string }

export const getServerSideProps: GetServerSideProps<Data> = async ({
  req,
  res,
}) => {
  return {
    props: {
      authenticated: !!getCookie('auth-token', { req, res }),
      name: (getCookie('auth-name', { req, res }) as string) ?? '',
    },
  }
}

export default function User(props: Data) {
  const [authenticated, setAuthenticated] = useState(props.authenticated)
  const [name, setName] = useState(props.name)
  const [count, setCount] = useState('?')

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
      <main className={`${inter.className} ${styles.main}`}>
        <div className={styles.center}>
          <h1>iltio Next.js Demo</h1>
          {authenticated ? (
            <>
              <p>Successfully logged in as "{name}".</p>
              <button
                className={styles.button}
                onClick={() => {
                  logout(true)
                  setAuthenticated(false)
                  setName('')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <p>Not authenticated.</p>
          )}
          <button
            className={styles.button}
            onClick={async () => {
              const result = await authorize()
              console.log('result', result)
            }}
          >
            Authorize
          </button>
          <button
            className={styles.button}
            onClick={() => {
              remove()
              setAuthenticated(false)
              setName('')
            }}
          >
            Delete Account
          </button>
          <button
            className={styles.button}
            onClick={async () => {
              const { error, count } = await (
                await fetch('/api/counter')
              ).json()
              setCount(error ? 'Error' : count ?? '?')
            }}
          >
            Load and Increment Count (Protected)
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
        </div>
      </main>
    </>
  )
}
