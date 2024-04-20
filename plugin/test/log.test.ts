import { expect, test, vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { log } from '../index'
import { mockFetch } from './helper'

const { fetchMockCalls, setResponse, getResponse } = mockFetch()

afterEach(() => {
  vi.restoreAllMocks()
})

test('Can log arbitrary events.', async () => {
  expect(fetchMockCalls().length).toBe(0)
  setResponse({ error: false })
  expect(await log('Message', 123)).toBe(false)
  expect(fetchMockCalls().length).toBe(1)
  expect(getResponse()).toEqual({ error: false })

  setResponse({ error: true })
  expect(await log('Failing message', 1234)).toBe(true)
  expect(fetchMockCalls().length).toBe(2)
  expect(getResponse()).toEqual({ error: true })
})
