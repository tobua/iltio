import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { Store } from 'iltio'
import { Authentication } from 'iltio/react'
import { createClient } from './interface'
import { Projects } from './projects'

function App() {
  const [loggedIn, setLoggedIn] = useState(!!Store.token)

  if (loggedIn) {
    return (
      <ApolloProvider client={createClient(Store.token)}>
        <Projects />
      </ApolloProvider>
    )
  }

  return <Authentication configuration={{ token: 'demo' }} onSuccess={() => setLoggedIn(true)} />
}

export const Colors = {
  blue: '#1EB4D4',
  raven: '#1B2738',
  albatross: '#e8f5ff',
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      fontFamily: 'sans-serif',
      color: Colors.raven,
      gap: 20,
    }}
  >
    <h1 style={{ marginBottom: 0 }}>iltio Hasura Demo</h1>
    <p style={{ margin: 0 }}>
      Backendless authentication and data storage and retrieval for the Web and Mobile
    </p>
    <App />
    <hr
      style={{
        width: '100%',
        background: '#EFEFEF',
        height: 1,
        border: 'none',
      }}
    />
    <svg height={50} viewBox="0 0 285 84" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#a)">
        <path
          d="M81.77 28.799c2.456-7.466.979-22.36-3.779-27.858-.623-.721-1.784-.618-2.302.178l-5.86 8.983c-1.448 1.798-4.057 2.21-6.023.955-6.36-4.065-13.955-6.426-22.118-6.426-8.162 0-15.758 2.361-22.117 6.426a4.597 4.597 0 0 1-6.023-.955l-5.86-8.983C7.168.323 6.007.229 5.384.94.628 6.449-.849 21.342 1.607 28.799c.815 2.482 1.035 5.105.556 7.652-.48 2.53-.96 5.583-.96 7.71 0 21.834 18.128 39.528 40.476 39.528 22.357 0 40.475-17.703 40.475-39.529 0-2.126-.48-5.18-.959-7.709-.47-2.547-.24-5.17.576-7.652ZM41.68 74.865c-17.284 0-31.335-13.733-31.335-30.612 0-.553.02-1.096.048-1.64.624-11.502 7.779-21.328 17.897-26.011 4.057-1.893 8.604-2.942 13.4-2.942 4.795 0 9.332 1.05 13.398 2.95 10.12 4.684 17.274 14.52 17.898 26.013.028.543.048 1.096.048 1.64-.01 16.87-14.07 30.602-31.354 30.602Z"
          fill="#1EB4D4"
        />
        <path
          d="M55.26 56.038 47.25 42.474l-6.867-11.306a.902.902 0 0 0-.777-.43h-6.56a.903.903 0 0 0-.787.449.853.853 0 0 0 .01.88l6.57 10.782-8.815 13.133a.867.867 0 0 0-.038.899c.153.28.46.459.796.459h6.608c.307 0 .595-.15.758-.403l4.767-7.269 4.277 7.24a.91.91 0 0 0 .777.441h6.513a.887.887 0 0 0 .777-.44.836.836 0 0 0 0-.871Z"
          fill="#1EB4D4"
        />
        <path
          d="M119.484 21.53h8.354v44.737h-8.354V47.206h-9.438v19.071h-8.354V21.531h8.354v19.427h9.438V21.53ZM153.61 66.276l-1.746-9.292h-10.022l-1.602 9.292h-8.354l9.217-44.737h11.25l9.659 44.737h-8.402Zm-10.675-15.465h7.769l-3.99-21.413-3.779 21.413ZM180.619 58.117v-9.573c0-.758-.143-1.264-.431-1.527-.288-.262-.825-.393-1.602-.393h-5.879c-4.988 0-7.481-2.36-7.481-7.09V28.554c0-4.683 2.608-7.016 7.835-7.016h7.99c5.227 0 7.836 2.342 7.836 7.016v6.238h-8.421v-5.105c0-.758-.144-1.264-.431-1.526-.288-.263-.825-.394-1.602-.394h-2.762c-.825 0-1.382.131-1.669.394-.288.262-.432.768-.432 1.526v9.002c0 .759.144 1.265.432 1.527.287.262.844.393 1.669.393h5.735c5.083 0 7.625 2.314 7.625 6.95v11.7c0 4.684-2.637 7.016-7.913 7.016h-7.845c-5.275 0-7.913-2.342-7.913-7.016v-6.173h8.344v5.03c0 .759.144 1.265.432 1.527.288.262.844.394 1.669.394h2.762c.777 0 1.304-.132 1.602-.394.297-.262.45-.768.45-1.527ZM211.32 21.53h8.344v37.722c0 4.683-2.637 7.015-7.912 7.015h-8.853c-5.275 0-7.913-2.341-7.913-7.015V21.53h8.354v36.587c0 .759.144 1.265.432 1.527.287.262.825.393 1.602.393h3.845c.825 0 1.382-.13 1.669-.393.288-.262.432-.768.432-1.527V21.531ZM234.914 48.836v17.441h-8.345V21.531h16.843c5.275 0 7.912 2.341 7.912 7.016V41.81c0 3.878-1.764 6.145-5.303 6.81l7.625 17.657h-9.006l-6.973-17.441h-2.753Zm0-21.067v15.034h6.023c.777 0 1.305-.131 1.602-.393.288-.263.431-.768.431-1.527V29.689c0-.759-.143-1.264-.431-1.527-.288-.262-.825-.393-1.602-.393h-6.023ZM276.589 66.276l-1.746-9.292H264.82l-1.602 9.292h-8.344l9.217-44.737h11.251L285 66.276h-8.411Zm-10.666-15.465h7.769l-3.99-21.413-3.779 21.413Z"
          fill="#1B2738"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h285v84H0z" />
        </clipPath>
      </defs>
    </svg>
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
