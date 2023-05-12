import { createSignal, createMemo, Show } from 'solid-js'
import { Label, countries, filterCountries } from 'iltio'

export function Phone(props) {
  const [open, setOpen] = createSignal(false)
  const [filter, setFilter] = createSignal('')
  const filteredCountries = filterCountries(filter())
  const country = createMemo(() => countries[props.countryCode()])

  return (
    <props.Components.PhoneWrapper
      style={props.style.phoneWrapper}
      variables={props.variables}
      valid={props.phoneValid}
    >
      <props.Components.PhoneTop style={props.style.phoneTop} variables={props.variables}>
        <props.Components.PhoneCountry
          prefix={country().prefix}
          flag={country().flag}
          variables={props.variables}
          togglePicker={() => setOpen(!open())}
          aria-label={Label.phoneCountry}
          data-country={props.countryCode()}
          style={props.style.phoneCountry}
        />
        <props.Components.PhoneInput
          aria-label={Label.inputPhone}
          aria-invalid={!props.phoneValid()}
          value={props.phone()}
          onInput={(event) => props.setPhone(event.currentTarget.value)}
          style={props.style.phoneInput}
          variables={props.variables}
          required
          valid={props.phoneValid}
          placeholder="Phone"
          type="tel"
        />
      </props.Components.PhoneTop>
      <Show when={open()}>
        <props.Components.PhoneCountryOptions
          style={props.style.phoneCountryOptions}
          variables={props.variables}
        >
          <props.Components.Input
            aria-label={Label.phoneInputCountrySearch}
            value={filter()}
            onInput={(event) => setFilter(event.currentTarget.value)}
            variables={props.variables}
            style={props.style.phoneInputCountrySearch}
            placeholder="Filter Countries"
            type="text"
          />
          {Object.values(filteredCountries).map((item) => (
            <props.Components.PhoneCountryOption
              aria-label={Label.phoneCountryOption}
              data-testid={item.abbreviation}
              variables={props.variables}
              selected={() => item.abbreviation === props.countryCode()}
              key={item.abbreviation}
              style={props.style.phoneCountryOption}
              onClick={() => {
                console.log('set', item.abbreviation)
                props.setCountryCode(item.abbreviation)
                setOpen(false)
              }}
            >
              {item.flag} {item.name}
            </props.Components.PhoneCountryOption>
          ))}
        </props.Components.PhoneCountryOptions>
      </Show>
    </props.Components.PhoneWrapper>
  )
}
