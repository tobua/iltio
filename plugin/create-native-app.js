#!/usr/bin/env node
import { copyFileSync, renameSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const appName = 'AuthenticationApp'

console.log('⌛ Initializing a fresh RN project...')

// Pods will be installed later in the script and a git repository isn't required here.
execSync(`npx react-native init ${appName} --install-pods false --skip-git-init true`, {
  stdio: 'inherit',
})

renameSync(appName, 'app')

copyFileSync('native/App.tsx', 'app/App.tsx')
// Enable experimental support for package "exports".
copyFileSync('native/metro.config.js', 'app/metro.config.js')

// Ensure plugin /dist contents are available
execSync('npm run build', {
  stdio: 'inherit',
})

// Install this package locally, avoiding symlinks.
execSync('npm install $(npm pack .. | tail -1) --legacy-peer-deps', {
  cwd: join(process.cwd(), 'app'),
  stdio: 'inherit',
})

// Additional dependency.
execSync('npm install iltio react-native-localize --legacy-peer-deps', {
  cwd: join(process.cwd(), 'app'),
  stdio: 'inherit',
})

// Linking for react-native-localize.
execSync('pod install', {
  cwd: join(process.cwd(), 'app/ios'),
  stdio: 'inherit',
})

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 npm run ios / npm run android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 npm run watch')
console.log('🛠️  This will copy changes over to the app.')
