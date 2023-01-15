import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  error?: boolean
  count?: number
}

let count = 0

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse<Data>
) {
  count += 1
  return response.status(200).json({ error: false, count })
}
