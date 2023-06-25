import React, { useState, useMemo, useTransition, useDeferredValue } from 'react'
import { Variables, Label, Text, filterCountries, countries } from 'iltio'
import { Styles, ComponentTypes } from './types'

interface Props {
  phoneValid: boolean
  variables: Variables
  countryCode: string
  setCountryCode: Function
  phone: string
  setPhone: Function
  Components: ComponentTypes
  style: Styles
  onSubmitEditing?: (event: any) => void
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
  onSubmitEditing,
}: Props) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const currentFilter = useDeferredValue(filter) // Ensure filter input stays responsive.
  const filteredCountries = useMemo(() => filterCountries(currentFilter), [currentFilter])
  const country = countries[countryCode]

  const [isPending, startTransition] = useTransition()

  return (
    <Components.PhoneWrapper
      aria-label={Label.phoneWrapper}
      style={style.phoneWrapper}
      variables={variables}
      valid={phoneValid}
    >
      <Components.PhoneTop style={style.phoneTop} variables={variables}>
        <Components.PhoneCountry
          prefix={country.prefix}
          flag={country.flag}
          variables={variables}
          togglePicker={() =>
            startTransition(() => {
              setOpen(!open)
            })
          }
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
          {...(onSubmitEditing ? { onSubmitEditing } : {})}
        />
      </Components.PhoneTop>
      {isPending && (
        <Components.PhoneCountryOptions style={style.phoneCountryOptions} variables={variables}>
          <Components.Message variables={variables}>Loading...</Components.Message>
        </Components.PhoneCountryOptions>
      )}
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
