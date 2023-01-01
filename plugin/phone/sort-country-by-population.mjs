import { writeFileSync } from 'fs'

// NOTE paste in countries from code or previous step.
const countries = null

if (!countries) {
  console.log('Missing countries, please edit file.')
}

const promises = Object.keys(countries).map(async (abbreviation) => {
  let result
  try {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${abbreviation}`)
    result = await response.json()
  } catch (error) {
    console.log('No population data found for ', abbreviation)
    result = { population: 0 }
  }

  countries[abbreviation].population = result[0].population
})

try {
  await Promise.all(promises)
} catch (error) {
  console.log('Error loading country data', error)
}

const sortedByPopulation = Object.keys(countries)
  .map((key) => countries[key])
  .sort((first, second) => second.population - first.population)
const recreatedSortedCountryObject = {}

sortedByPopulation.forEach((country) => {
  delete country.population
  recreatedSortedCountryObject[country.abbreviation] = country
})

writeFileSync('./countries.json', JSON.stringify(recreatedSortedCountryObject, null, 2))
