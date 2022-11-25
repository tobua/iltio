import React from 'react'
import { Label } from '../label'
import * as flags from './flags'

const countries = {
  us: {
    prefix: '+1',
    name: 'United States',
    abbreviation: 'us',
  },
  ch: {
    prefix: '+41',
    name: 'Switzerland',
    abbreviation: 'ch',
  },
  de: {
    prefix: '+49',
    name: 'Germany',
    abbreviation: 'de',
  },
  fr: {
    prefix: '+33',
    name: 'France',
    abbreviation: 'fr',
  },
  it: {
    prefix: '+39',
    name: 'Italy',
    abbreviation: 'it',
  },
  gb: {
    prefix: '+44',
    name: 'United Kingdom',
    abbreviation: 'gb',
  },
}

export const getNumberCountryPrefix = (countryCode: string) => countries[countryCode].prefix

export function Phone({ phoneValid, style, countryCode, setCountryCode, phone, setPhone }) {
  const Flag = flags[countryCode.toUpperCase()] ?? (() => <span />)

  return (
    <div
      style={{
        display: 'flex',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: phoneValid ? style.color : 'red',
        borderRadius: style.borderRadius,
        paddingLeft: 10,
      }}
    >
      <span style={{ display: 'flex', justifyContent: 'center', width: 30 }}>
        <Flag />
      </span>
      <span
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 60 }}
      >
        {countries[countryCode].prefix}
      </span>
      <select
        style={{ border: 'none', outline: 'none', background: 'none', width: 20 }}
        value={countryCode}
        onChange={(event) => setCountryCode(event.target.value)}
      >
        {Object.values(countries).map((country) => (
          <option key={country.prefix} value={country.abbreviation}>
            {country.name}
          </option>
        ))}
      </select>
      <input
        aria-label={Label.inputPhone}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        style={{
          background: 'none',
          border: 'none',
          padding: 9,
          outline: 'none',
          width: '100%',
        }}
        required
        placeholder="Phone"
        type="tel"
      />
    </div>
  )
}
