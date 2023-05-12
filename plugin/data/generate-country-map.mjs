import { readFileSync, writeFileSync } from 'node:fs'
import { countryCodeEmoji } from 'country-code-emoji'

// https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/assets/data/countries-emoji.json
const input = JSON.parse(readFileSync('./country.json'))

const result = {}

for (const [key, value] of Object.entries(input)) {
  if (!value.callingCode || value.callingCode.length !== 1) {
    console.log('skip', value.name.common, value.callingCode)
  } else {
    result[key.toLowerCase()] = {
      prefix: `+${value.callingCode[0]}`,
      name: value.name.common,
      abbreviation: key.toLowerCase(),
      flag: countryCodeEmoji(key.toUpperCase()),
    }
  }
}

writeFileSync('./output.json', JSON.stringify(result))
