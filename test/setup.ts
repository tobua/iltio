import { test as base, expect } from '@playwright/test'
import type { MockServiceWorker } from 'playwright-msw'
import { createWorkerFixture } from 'playwright-msw'
import { HttpResponse, delay, http } from 'msw'

const handlers = [
  http.get('/api/authenticate', async () => {
    await delay(100)
    return HttpResponse.json(
      [
        {
          id: 'bcff5c0e-10b6-407b-94d1-90d741363885',
          firstName: 'Rhydian',
          lastName: 'Greig',
        },
      ],
      { status: 200 },
    )
  }),
]

const test = base.extend<{ worker: MockServiceWorker }>({
  worker: createWorkerFixture(handlers),
})

export { test, expect }
