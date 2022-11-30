# iltio

<img align="right" src="https://github.com/tobua/iltio/raw/main/plugin/logo.png" width="20%" alt="iltio Authentication Plugin" />

React and React Native plugins to integrate [iltio.com](https://iltio.com) Authentication into any website or application.

```sh
npm install iltio
```

## Usage

```tsx
import { Form, configure } from 'iltio'

configure({ token: APP_TOKEN })

export function MyAuthentication() {
  return (
    <Form
      onSuccess={(name, token) => {
        redirect('/overview', { name })
      }}
    />
  )
}
```
