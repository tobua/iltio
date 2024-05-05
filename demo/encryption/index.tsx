import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Store, configure, authorize, logout, remove } from 'iltio'
import { Authentication, Encryption } from 'iltio/react'

configure({
  token: 'demo',
  // url: 'http://localhost:3000/api',
  storage: window.localStorage,
})

const App = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      return
    }
    const load = async () => {
      if (Store.token) {
        const { error, name } = await authorize()

        if (error) {
          await logout()
          window.location.reload()
        }

        if (name) {
          setName(name)
        }
      }

      setLoading(false)
    }
    load()
  }, [loading, setLoading])

  if (loading) {
    return <p>Loading</p>
  }

  if (name) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <span>Logged in as: {name}</span>
        <button
          style={{
            border: 'none',
            background: 'black',
            color: 'white',
            padding: 10,
            cursor: 'pointer',
          }}
          onClick={() => {
            logout()
            setName('')
          }}
        >
          Logout
        </button>
        <button
          style={{
            border: 'none',
            background: 'black',
            color: 'white',
            padding: 10,
            cursor: 'pointer',
          }}
          onClick={async () => {
            await remove()
            setName('')
          }}
        >
          Delete my Account
        </button>
        <div
          id="encryption"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h3>Client-side Encryption</h3>
          <Encryption onDone={() => alert('Done!')} />
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 40,
          justifyContent: 'center',
        }}
      >
        <div id="base" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p>Regular Form</p>
          <Authentication
            configuration={{ token: 'demo' }}
            onSuccess={(name, token, registration) => {
              console.log('success', name, token, registration)
              setName(name)
            }}
          />
        </div>
      </div>
      <p style={{ margin: 0 }}>
        Enter an email address or phone number above to register or login to the demo application.
      </p>
    </>
  )
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      gap: 20,
    }}
  >
    <h1 style={{ marginBottom: 0 }}>iltio Encryption Demo</h1>
    <p style={{ margin: 0 }}>Authentication with client-side encryption</p>
    <App />
    <hr
      style={{
        width: '100%',
        background: '#EFEFEF',
        height: 1,
        border: 'none',
      }}
    />
    <div style={{ display: 'flex', justifySelf: 'flex-end', gap: 20 }}>
      <a
        style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}
        href="https://iltio.com/getting-started"
      >
        Documentation
      </a>
      <a
        style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}
        href="https://github.com/tobua/iltio"
      >
        GitHub
      </a>
    </div>
  </div>,
)
