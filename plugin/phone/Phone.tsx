import React from 'react'
import { Label } from '../label'
import { Variables, Styles } from '../types'
import * as flags from './flags'
import { ComponentTypes } from '../components'

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
  Components: ComponentTypes
  style: Styles
}

export function Phone({
  phoneValid,
  variables,
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  Components,
  style,
}: Props) {
  const Flag = flags[countryCode.toUpperCase()] ?? (() => <span />)

  return (
    <Components.PhoneWrapper style={style.phoneWrapper} variables={variables} valid={phoneValid}>
      <Components.PhoneFlag style={style.phoneFlag} variables={variables}>
        <Flag />
      </Components.PhoneFlag>
      <Components.PhonePrefix
        aria-label={Label.phonePrefix}
        style={style.phonePrefix}
        variables={variables}
      >
        {countries[countryCode].prefix}
      </Components.PhonePrefix>
      <Components.PhoneSelect
        aria-label={Label.phoneCountry}
        style={style.phoneSelect}
        value={countryCode}
        variables={variables}
        onChange={(event) => setCountryCode(event.target.value)}
      >
        {Object.values(countries).map((country) => (
          <Components.PhoneOption
            key={country.prefix}
            value={country.abbreviation}
            style={style.phoneOption}
            variables={variables}
          >
            {country.name}
          </Components.PhoneOption>
        ))}
      </Components.PhoneSelect>
      <Components.PhoneInput
        aria-label={Label.inputPhone}
        aria-invalid={!phoneValid}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        style={style.phoneInput}
        required
        valid={phoneValid}
        placeholder="Phone"
        type="tel"
      />
    </Components.PhoneWrapper>
  )
}
