import { db } from '../../db'
import { events } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }

  await db.delete(events).where(eq(events.id, id))

  return { success: true }
})