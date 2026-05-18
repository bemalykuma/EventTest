import { db } from '../db'
import { events } from '../db/schema'

export default defineEventHandler(async () => {
  const result = await db.select().from(events)
  return result
})