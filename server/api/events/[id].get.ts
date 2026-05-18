import { db } from '../../db'
import { events } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }

  const [result] = await db.select().from(events).where(eq(events.id, id))

  if (!result) {
    throw createError({ statusCode: 404, message: 'Event not found' })
  }

  return result
})