import { execSync } from 'node:child_process'
import { cpSync, renameSync } from 'node:fs'

const appName = 'AuthenticationApp'

console.log('⌛ Initializing a fresh RN project...')

execSync(
  `bunx @react-native-community/cli init ${appName} --skip-git-init true --install-pods true`,
  {
    // Write output to cnosole.
    stdio: 'inherit',
  },
)

cpSync('native/App.tsx', `${appName}/App.tsx`)
// Enable experimental support for package "exports".
cpSync('native/metro.config.js', `${appName}/logo.png`)
renameSync(appName, 'app')

// Ensure plugin /dist contents are available
execSync('bun run build', {
  stdio: 'inherit',
})

const output = execSync('bun pm pack', {
  encoding: 'utf-8',
})

const tgzFileName = output.match(/[\w.-]+\.tgz/)[0]

execSync(`bun install react-native-localize ../${tgzFileName}`, {
  cwd: './app',
})

console.log('⌛ Updating pods for new architecture.')

execSync('RCT_NEW_ARCH_ENABLED=1 pod update', {
  cwd: './app/ios',
})

console.log('')
console.log('🍞 React Native App created inside /app.')
console.log('🛠️  To run the example with the plugin included:')
console.log('🐚 cd app')
console.log('🐚 bun ios / bun android')
console.log('🌪️  To copy over the changes from the plugin source run:')
console.log('🐚 bun start & bun app:copy')
console.log('🛠️  This will copy changes over to the app.')
