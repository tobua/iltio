import { joinUrl } from '../helper'

test('Properly joins URLs.', () => {
  expect(joinUrl('/authorize')).toBe('https://iltio.com/api/authorize')
  expect(joinUrl('authorize?token=123&more=456')).toBe(
    'https://iltio.com/api/authorize?token=123&more=456',
  )

  // Another base.
  expect(joinUrl('authorize?token=123&more=456', 'http://localhost:3001/nested/deep/')).toBe(
    'http://localhost:3001/nested/deep/authorize?token=123&more=456',
  )
})
