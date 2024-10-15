import { createRoot } from 'react-dom/client'
import { Authentication } from 'iltio/base'
import { CustomUIComponents } from './custom'

createRoot(document.body).render(
  <div style={{ fontFamily: 'sans-serif' }}>
    <h1>iltio React Base Demo</h1>
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 40,
        justifyContent: 'center',
      }}
    >
      <div id="base" style={{ display: 'flex', justifyContent: 'center' }}>
        <Authentication
          configuration={{ token: 'demo' }}
          onSuccess={(name, token, uid, registration) =>
            console.log('success', name, token, uid, registration)
          }
        />
      </div>
      <div id="phone" style={{ display: 'flex', justifyContent: 'center' }}>
        <Authentication allowMail={false} />
      </div>
      <div
        id="properties"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
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
        />
      </div>
      <div id="custom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CustomUIComponents />
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
        <Authentication
          variables={{ fontSize: 'inherit', color: 'inherit', contrast: 'red' }}
          labels={{ submit: 'Inherited Background??', tabMail: 'E-Mail' }}
        />
      </div>
    </div>
  </div>,
)
