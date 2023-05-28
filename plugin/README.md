# iltio

<img align="right" src="https://github.com/tobua/iltio/raw/main/plugin/logo.png" width="20%" alt="iltio Authentication Plugin" />

React and React Native plugins to integrate [iltio.com](https://iltio.com) Authentication into any website or application.

```sh
npm install iltio
```

## Usage

```tsx
import { Authentication } from 'iltio/react'

export function MyAuthentication() {
  return (
    <Authentication
      configuration={{ token: APP_TOKEN }}
      onSuccess={(name, token) => {
        redirect('/overview', { name })
      }}
    />
  )
}
```
