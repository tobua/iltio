<template>
  <PhoneWrapper
    :aria-label="Label.phoneWrapper"
    :style="style.phoneWrapper"
    :variables="variables"
    :valid="phoneValid"
  >
    <PhoneTop :style="style.phoneTop" :variables="variables">
      <PhoneCountry
        :prefix="country.prefix"
        :flag="country.flag"
        :variables="variables"
        @click="() => setOpen(!open)"
        :aria-label="Label.phoneCountry"
        :data-country="countryCode"
        :style="style.phoneCountry"
      />
      <PhoneInput
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
    </PhoneTop>
    <PhoneCountryOptions v-if="open" :style="style.phoneCountryOptions" :variables="variables">
      <Input
        :aria-label="Label.phoneInputCountrySearch"
        :value="filter"
        @input="(event) => setFilter(event.target.value)"
        :variables="variables"
        :style="style.phoneInputCountrySearch"
        :placeholder="Text.FilterCountriesInputPlaceholder"
        type="text"
      />
      <template v-for="item in Object.values(filteredCountries)" :key="item.abbreviation">
        <PhoneCountryOption
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
        </PhoneCountryOption>
      </template>
    </PhoneCountryOptions>
  </PhoneWrapper>
</template>

<script>
import { countries, Text, Label, filterCountries } from 'iltio'
import Input from './components/Input.vue'
import PhoneWrapper from './components/PhoneWrapper.vue'
import PhoneTop from './components/PhoneTop.vue'
import PhoneInput from './components/PhoneInput.vue'
import PhoneCountryOptions from './components/PhoneCountryOptions.vue'
import PhoneCountryOption from './components/PhoneCountryOption.vue'
import PhoneCountry from './components/PhoneCountry.vue'

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
      Text,
      Label,
    }
  },
  components: {
    Input,
    PhoneWrapper,
    PhoneTop,
    PhoneInput,
    PhoneCountryOptions,
    PhoneCountryOption,
    PhoneCountry,
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
