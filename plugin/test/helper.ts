import { vi, Mock } from 'vitest'

export const mockFetch = () => {
  let response: any = { error: true }

  // @ts-ignore
  window.fetch = vi.fn(
    () =>
      new Promise<{ json: any }>((done) =>
        done({ json: () => new Promise((done) => done(response)) })
      )
  )

  const fetchMockCalls = (window.fetch as Mock).mock.calls

  return {
    fetchMockCalls,
    setResponse: (newResponse: any) => {
      response = newResponse
    },
    getResponse: () => response,
    resetFetchMock: () => (window.fetch as Mock).mockRestore(),
  }
}

export const mockInterval = () => {
  const intervals: Function[] = []
  let lastDuration = 0
  // @ts-ignore
  setInterval = (method: Function, duration: number) => {
    intervals.push(method)
    lastDuration = duration
  }

  return {
    runInterval: () => intervals.forEach((method) => method()),
    resetIntervalMocks: () => intervals.splice(0, intervals.length),
    getDuration: () => lastDuration,
  }
}

export const wait = (duration = 10) => new Promise((done) => setTimeout(done, duration))
