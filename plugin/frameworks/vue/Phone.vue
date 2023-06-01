<template>
  <component
    :is="PhoneWrapper"
    :aria-label="Label.phoneWrapper"
    :style="style.phoneWrapper"
    :variables="variables"
    :valid="phoneValid"
  >
    <component :is="PhoneTop" :style="style.phoneTop" :variables="variables">
      <component
        :is="PhoneCountry"
        :prefix="country.prefix"
        :flag="country.flag"
        :variables="variables"
        @click="() => setOpen(!open)"
        :aria-label="Label.phoneCountry"
        :data-country="countryCode"
        :style="style.phoneCountry"
      />
      <component
        :is="PhoneInput"
        :aria-label="Label.inputPhone"
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
    </component>
    <component
      :is="PhoneCountryOptions"
      v-if="open"
      :style="style.phoneCountryOptions"
      :variables="variables"
    >
      <component
        :is="Input"
        :aria-label="Label.phoneInputCountrySearch"
        :value="filter"
        @input="(event) => setFilter(event.target.value)"
        :variables="variables"
        :style="style.phoneInputCountrySearch"
        :placeholder="Text.FilterCountriesInputPlaceholder"
        type="text"
      />
      <template v-for="item in Object.values(filteredCountries)" :key="item.abbreviation">
        <component
          :is="PhoneCountryOption"
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
        </component>
      </template>
    </component>
  </component>
</template>

<script>
import { countries, Text, Label, filterCountries } from 'iltio'

export default {
  props: {
    phoneValid: Boolean,
    variables: Object,
    countryCode: String,
    setCountryCode: Function,
    phone: String,
    setPhone: Function,
    Input: Function,
    PhoneWrapper: Function,
    PhoneTop: Function,
    PhoneInput: Function,
    PhoneCountryOptions: Function,
    PhoneCountryOption: Function,
    PhoneCountry: Function,
    style: Object,
  },
  data() {
    return {
      open: false,
      filter: '',
      Text,
      Label,
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
