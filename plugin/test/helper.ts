export const mockFetch = () => {
  let response: any = { error: true }

  // @ts-ignore
  window.fetch = vi.fn(
    () =>
      new Promise<{ json: any }>((done) =>
        done({ json: () => new Promise((done) => done(response)) })
      )
  )

  const fetchMockCalls = (window.fetch as any).mock.calls

  return {
    fetchMockCalls,
    setResponse: (newResponse: any) => {
      response = newResponse
    },
    getResponse: () => response,
  }
}

export const wait = (duration = 10) => new Promise((done) => setTimeout(done, duration))
