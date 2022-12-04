import React from 'react'
import { Label } from '../label'
import { Variables } from '../types'
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


interface Props {
  phoneValid: boolean
  variables: Variables
  countryCode: string
  setCountryCode: Function
  phone: string
  setPhone: Function
}

export function Phone({
  phoneValid,
  variables,
  countryCode,
  setCountryCode,
  phone,
  setPhone,
}: Props) {
  const Flag = flags[countryCode.toUpperCase()] ?? (() => <span />)

  return (
    <div
      style={{
        display: 'flex',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: phoneValid ? variables.color : 'red',
        borderRadius: variables.borderRadius,
        paddingLeft: 10,
      }}
    >
      <span style={{ display: 'flex', justifyContent: 'center', width: 30 }}>
        <Flag />
      </span>
      <span
        aria-label={Label.phonePrefix}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 60 }}
      >
        {countries[countryCode].prefix}
      </span>
      <select
        aria-label={Label.phoneCountry}
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
