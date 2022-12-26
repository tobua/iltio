# iltio - React Native Plugin

Based on the React plugin the React Native plugin features the same functionality except for a native UI.

## Installation and Usage

```tsx
import { NativeForm, configure } from 'iltio'

configure({ token: APP_TOKEN })

export const MyNativeAuthentication = () => <NativeForm {...} />
```

## Demo

To run the demo application check out this repository and run `npm run app` inside the `/plugin` folder. This will download the React Native template and copy the demo `App.tsx` into the `/plugin/app` folder. Inside `/plugin/app/ios` run `pod install` before running the demo app with `npm run ios` inside `/plugin/app`.
