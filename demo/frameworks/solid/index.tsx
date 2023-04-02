import { render } from 'solid-js/web'
import { Authentication } from 'iltio/solid'

render(
  () => (
    <div style={{ 'font-family': 'sans-serif' }}>
      <h1>iltio Solid Demo</h1>
      <Authentication
        configuration={{ token: 'demo' }}
        onSuccess={(name, token) => console.log('Authenticated: ', name, token)}
      />
    </div>
  ),
  document.body
)
