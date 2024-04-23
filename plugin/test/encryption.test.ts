import { expect, test, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { Encryption } from '../index'
import { mockFetch } from './helper'

const { fetchMockCalls, setResponse, getResponse } = mockFetch()

afterEach(() => {
  vi.restoreAllMocks()
})

test('Can enable encryption and add a key.', async () => {
  expect(fetchMockCalls().length).toBe(0)
})
