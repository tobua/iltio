# iltio

<img align="right" src="https://github.com/tobua/iltio/raw/main/plugin/logo.png" width="20%" alt="iltio Authentication Plugin" />

React, React Native, Vue, Svelte and Next.js and plugins to integrate [iltio.com](https://iltio.com) Authentication into any website or application.

```sh
npm install iltio
```

Register for your `APP_TOKEN` and check out the detailed documentation at [iltio.com/getting-started](https://iltio.com/getting-started).

## React

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

## React Native

```tsx
import { Authentication } from 'iltio/native' // Requires "unstable_enablePackageExports" in metro configuration.
import { Authentication } from 'iltio/dist/native/index.js' // Fallback without exports.

export const MyForm = () => <Authentication {...} />
```

## Vue

```vue
<script>
import Authentication from 'iltio/vue'
</script>

<template>
  <Authentication :configuration="{ token: 'demo' }" :on-success="(name) => console.log(name)" />
</template>
```

## Svelte

```svelte
<script>
  import Authentication from 'iltio/svelte'
</script>

<Authentication configuration={{ token: 'demo' }} onSuccess={(name) => console.log(name)} />
```
