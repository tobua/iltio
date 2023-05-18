import React, { useState } from 'react'
import { countries, Label, filterCountries, Text } from 'iltio'

export function Phone({
  phoneValid,
  variables,
  countryCode,
  setCountryCode,
  phone,
  setPhone,
  Components,
  style,
}: any) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const filteredCountries = filterCountries(filter)
  const country = countries[countryCode]

  return (
    <Components.PhoneWrapper style={style.phoneWrapper} variables={variables} valid={phoneValid}>
      <Components.PhoneTop style={style.phoneTop} variables={variables}>
        <Components.PhoneCountry
          prefix={country.prefix}
          flag={country.flag}
          variables={variables}
          togglePicker={() => setOpen(!open)}
          aria-label={Label.phoneCountry}
          data-country={countryCode}
          style={style.phoneCountry}
        />
        <Components.PhoneInput
          aria-label={Label.inputPhone}
          aria-invalid={!phoneValid}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          style={style.phoneInput}
          variables={variables}
          required
          valid={phoneValid}
          placeholder={Text.PhoneInputPlaceholder}
          type="tel"
        />
      </Components.PhoneTop>
      {open && (
        <Components.PhoneCountryOptions style={style.phoneCountryOptions} variables={variables}>
          <Components.Input
            aria-label={Label.phoneInputCountrySearch}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            variables={variables}
            style={style.phoneInputCountrySearch}
            placeholder={Text.FilterCountriesInputPlaceholder}
            type="text"
          />
          {Object.values(filteredCountries).map((item) => (
            <Components.PhoneCountryOption
              aria-label={Label.phoneCountryOption}
              data-testid={item.abbreviation}
              variables={variables}
              selected={item.abbreviation === countryCode}
              key={item.abbreviation}
              style={style.phoneCountryOption}
              onSelect={() => {
                setCountryCode(item.abbreviation)
                setOpen(!open)
              }}
            >
              {item.flag} {item.name}
            </Components.PhoneCountryOption>
          ))}
        </Components.PhoneCountryOptions>
      )}
    </Components.PhoneWrapper>
  )
}
