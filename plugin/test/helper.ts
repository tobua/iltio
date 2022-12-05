import { vi, Mock } from 'vitest'

export const mockFetch = () => {
  let response: any = { error: true }

  // @ts-ignore
  window.fetch = vi.fn(
    () =>
      new Promise<{ json: any }>((done) =>
        // eslint-disable-next-line no-promise-executor-return
        done({ json: () => new Promise((innerDone) => innerDone(response)) })
      )
  )

  return {
    fetchMockCalls: () => (window.fetch as Mock).mock.calls,
    setResponse: (newResponse: any) => {
      response = newResponse
    },
    getResponse: () => response,
  }
}

export const mockInterval = () => {
  const intervals: Function[] = []
  let lastDuration = 0
  // @ts-ignore
  // eslint-disable-next-line no-global-assign
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

export const wait = (duration = 10) =>
  new Promise((done) => {
    setTimeout(done, duration)
  })
