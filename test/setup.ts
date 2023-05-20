import { test as base, expect } from '@playwright/test'
import type { MockServiceWorker } from 'playwright-msw'
import { createWorkerFixture } from 'playwright-msw'
import { rest } from 'msw'

const handlers = [
  rest.get('/api/authenticate', (_, response, context) =>
    response(
      context.delay(100),
      context.status(200),
      context.json([
        {
          id: 'bcff5c0e-10b6-407b-94d1-90d741363885',
          firstName: 'Rhydian',
          lastName: 'Greig',
        },
      ])
    )
  ),
]

const test = base.extend<{ worker: MockServiceWorker }>({
  worker: createWorkerFixture(handlers),
})

export { test, expect }
