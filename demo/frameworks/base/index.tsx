import { createRoot } from 'react-dom/client'
import { Authentication } from 'iltio/base'

createRoot(document.body).render(
  <div style={{ fontFamily: 'sans-serif' }}>
    <h1>iltio React Base Demo</h1>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Authentication token="demo" onSuccess={() => console.log('success')} />
    </div>
  </div>
)
