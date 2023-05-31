import { createRoot } from 'react-dom/client'
import { Authentication } from 'iltio/base'

createRoot(document.body).render(
  <div style={{ fontFamily: 'sans-serif' }}>
    <h1>iltio React Base Demo</h1>
    <div id="base" style={{ display: 'flex', justifyContent: 'center' }}>
      <Authentication
        configuration={{ token: 'demo' }}
        onSuccess={(name, token, registration) => console.log('success', name, token, registration)}
      />
    </div>
  </div>
)
