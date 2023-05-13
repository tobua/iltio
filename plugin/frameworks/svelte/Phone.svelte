<script>
  import { countries, Label, Text, filterCountries } from 'iltio'

  export let variables, style, Components, phoneValid, countryCode, setCountryCode, phone, setPhone

  let open = false
  let filter = ''
  const filteredCountries = filterCountries(filter)
  $: country = countries[countryCode]

  const setOpen = (value) => {
    open = value
  }
</script>

<Components.PhoneWrapper style={style.phoneWrapper} {variables} valid={phoneValid}>
  <Components.PhoneTop style={style.phoneTop} {variables}>
    <Components.PhoneCountry
      prefix={country.prefix}
      flag={country.flag}
      {variables}
      on:click={() => setOpen(!open)}
      aria-label={Label.phoneCountry}
      data-country={countryCode}
      style={style.phoneCountry}
    />
    <Components.PhoneInput
      aria-label={Label.inputPhone}
      aria-invalid={!phoneValid}
      bind:value={phone}
      style={style.phoneInput}
      {variables}
      required
      valid={phoneValid}
      placeholder={Text.PhoneInputPlaceholder}
      type="tel"
    />
  </Components.PhoneTop>
  {#if open}
    <Components.PhoneCountryOptions style={style.phoneCountryOptions} {variables}>
      <Components.Input
        aria-label={Label.phoneInputCountrySearch}
        bind:value={filter}
        on:input={(event) => setPhone(event.target.value)}
        {variables}
        style={style.phoneInputCountrySearch}
        placeholder={Text.FilterCountriesInputPlaceholder}
        type="text"
      />
      {#each Object.values(filteredCountries) as item}
        <Components.PhoneCountryOption
          aria-label={Label.phoneCountryOption}
          data-testid={item.abbreviation}
          {variables}
          selected={item.abbreviation === countryCode}
          key={item.abbreviation}
          style={style.phoneCountryOption}
          on:click={() => {
            setCountryCode(item.abbreviation)
            setOpen(!open)
          }}
        >
          {item.flag}
          {item.name}
        </Components.PhoneCountryOption>
      {/each}
    </Components.PhoneCountryOptions>
  {/if}
</Components.PhoneWrapper>
