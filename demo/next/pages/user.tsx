import { useState } from 'react'
import { getCookie } from 'cookies-next'
import { configure, CookieStorage, logout, remove } from 'iltio'
import { GetServerSideProps } from 'next'
import styles from '../styles/app.module.css'

configure({
  url: '/api/authentication',
  token: 'demo',
  storage: CookieStorage,
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

  return authenticated ? (
    <>
      <p>Successfully logged in as &quot;{name}&quot;.</p>
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
    </>
  ) : (
    <p>Not authenticated.</p>
  )
}
