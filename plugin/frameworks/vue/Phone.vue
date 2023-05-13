<template>
  <Components.PhoneWrapper :style="style.phoneWrapper" :variables="variables" :valid="phoneValid">
    <Components.PhoneTop :style="style.phoneTop" :variables="variables">
      <Components.PhoneCountry
        :prefix="country.prefix"
        :flag="country.flag"
        :variables="variables"
        @togglePicker="() => setOpen(!open)"
        aria-label="phoneCountry"
        :data-country="countryCode"
        :style="style.phoneCountry"
      />
      <Components.PhoneInput
        aria-label="inputPhone"
        :aria-invalid="!phoneValid"
        :value="phone"
        @input="(event) => setPhone(event.target.value)"
        :style="style.phoneInput"
        :variables="variables"
        required
        :valid="phoneValid"
        :placeholder="Text.PhoneInputPlaceholder"
        type="tel"
      />
    </Components.PhoneTop>
    <Components.PhoneCountryOptions
      v-if="open"
      :style="style.phoneCountryOptions"
      :variables="variables"
    >
      <Components.Input
        aria-label="phoneInputCountrySearch"
        :value="filter"
        @input="(event) => setFilter(event.target.value)"
        :variables="variables"
        :style="style.phoneInputCountrySearch"
        :placeholder="Text.FilterCountriesInputPlaceholder"
        type="text"
      />
      <template v-for="item in Object.values(filteredCountries)" :key="item.abbreviation">
        <Components.PhoneCountryOption
          aria-label="phoneCountryOption"
          :data-testid="item.abbreviation"
          :variables="variables"
          :selected="item.abbreviation === countryCode"
          :style="style.phoneCountryOption"
          @click="
            () => {
              setCountryCode(item.abbreviation)
              setOpen(!open)
            }
          "
        >
          {{ item.flag }} {{ item.name }}
        </Components.PhoneCountryOption>
      </template>
    </Components.PhoneCountryOptions>
  </Components.PhoneWrapper>
</template>

<script>
import { countries, Label, filterCountries } from 'iltio'

export default {
  props: {
    phoneValid: Boolean,
    variables: Object,
    countryCode: String,
    setCountryCode: Function,
    phone: String,
    setPhone: Function,
    Components: Object,
    style: Object,
  },
  data() {
    return {
      open: false,
      filter: '',
    }
  },
  computed: {
    filteredCountries() {
      return filterCountries(this.filter)
    },
    country() {
      return countries[this.countryCode]
    },
  },
  methods: {
    setOpen(value) {
      this.open = value
    },
    setFilter(value) {
      this.filter = value
    },
  },
}
</script>
