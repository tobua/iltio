import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Store, configure, authorize, logout, remove } from 'iltio'
import { Authentication, Encryption } from 'iltio/react'
import { CustomUIComponents } from './custom-ui-components'

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
            onSuccess={(name, token, uid, registration) => {
              console.log('success', name, token, uid, registration)
              setName(name)
            }}
          />
        </div>
        <div id="phone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p>Phone Only</p>
          <Authentication allowMail={false} onSuccess={setName} />
        </div>
        <div
          id="properties"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <p>Custom Variables & Style</p>
          <Authentication
            variables={{
              color: 'blue',
              borderRadius: 10,
            }}
            style={{
              form: {
                width: 130,
              },
            }}
            onSuccess={setName}
          />
        </div>
        <div id="custom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p>Custom UI Components</p>
          <CustomUIComponents onSuccess={setName} />
        </div>
        <div
          id="styles"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'green',
            fontSize: 14,
            fontFamily: 'monospace',
            backgroundColor: 'lightgray',
            padding: 10,
          }}
        >
          <p>Inherited Styles</p>
          <Authentication
            variables={{ fontSize: 'inherit', color: 'inherit', contrast: 'red' }}
            labels={{ submit: 'Inherited Background??', tabMail: 'E-Mail' }}
            onSuccess={setName}
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
    <h1 style={{ marginBottom: 0 }}>iltio Demo</h1>
    <p style={{ margin: 0 }}>Authentication for the Web and Mobile</p>
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
