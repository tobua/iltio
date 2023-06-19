import { useState, useCallback } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import styles from '../styles/app.module.css'

const Verify: NextPage = () => {
  const {
    query: { code = '0000', token },
  } = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleLogin = useCallback(async () => {
    setSubmitting(true)
    setError('')

    // token is the codeToken for mail, and the shorter linkToken for phone.
    const response = await fetch(
      `/api/authentication/verify/confirm?code=${code}&token=${token}`
    )
    const { error } = await response.json()

    if (error) {
      setSubmitting(false)
      setError(error === true ? 'An unknown error occurred.' : error)
      return
    }

    setSubmitting(false)
    setSuccess(true)
  }, [code, token])

  return (
    <>
      <h2>Confirm Login</h2>
      {!success && (
        <button className={styles.button} type="submit" onClick={handleLogin}>
          {submitting ? 'Loading...' : 'Confirm Login'}
        </button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && (
        <>
          <p>Login confirmed</p>
          <button className={styles.button} onClick={() => window.close()}>
            Close page
          </button>
        </>
      )}
    </>
  )
}

export default Verify
