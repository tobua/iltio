import { log as logRoute } from './route'

export async function log(message: string, eventId: number) {
  return (await logRoute(message, eventId)).error
}
