import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Form, Store, configure, authorize, logout, remove } from 'iltio'

configure({
  token: 'demo',
  storage: window.localStorage,
})

const themes = {
  default: {},
  blue: {
    color: 'blue',
  },
  redRounded: {
    color: 'red',
    borderRadius: 10,
  },
}

const buttonStyle = {
  outline: 'none',
  border: 'none',
  background: 'gray',
  color: 'white',
  padding: 10,
  cursor: 'pointer',
}

const App = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(themes.default)

  useEffect(() => {
    if (!loading) {
      return
    }
    const load = async () => {
      if (Store.token) {
        const { name } = await authorize()

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
            logout()
            setName('')
          }}
        >
          Delete my Account
        </button>
      </div>
    )
  }

  return (
    <>
      <Form variables={theme} onSuccess={setName} />
      <p style={{ margin: 0 }}>
        Enter an email address or phone number above to register or login to the demo application.
        Select a theme to use for the form below.
      </p>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <span>Theme:</span>
        <button
          style={{
            ...buttonStyle,
            ...(theme === themes.default && {
              background: 'black',
              color: 'white',
            }),
          }}
          onClick={() => setTheme(themes.default)}
        >
          Default
        </button>
        <button
          style={{
            ...buttonStyle,
            background: 'blue',
            ...(theme === themes.blue && {
              background: 'black',
              color: 'white',
            }),
          }}
          onClick={() => setTheme(themes.blue)}
        >
          Blue
        </button>
        <button
          style={{
            ...buttonStyle,
            background: 'red',
            ...(theme === themes.redRounded && {
              background: 'black',
              color: 'white',
            }),
          }}
          onClick={() => setTheme(themes.redRounded)}
        >
          Red Rounded
        </button>
      </div>
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
      gap: 40,
    }}
  >
    <h1>iltio Demo</h1>
    <p style={{ margin: 0 }}>Authentication for the Web and Mobile</p>
    <p style={{ textAlign: 'center', fontSize: '150%', margin: 0 }}>Login or Register</p>
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
  </div>
)
