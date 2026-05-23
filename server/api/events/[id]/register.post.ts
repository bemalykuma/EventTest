import { eq, sql } from 'drizzle-orm'
import { db } from '../../../../server/db'
import { events } from '../../../../server/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing event id' })

  const [existing] = await db
    .select({
      maxParticipants: events.maxParticipants,
      registeredCount: events.registeredCount,
    })
    .from(events)
    .where(eq(events.id, id))

  if (!existing) throw createError({ statusCode: 404, message: 'Event not found' })

  const current = existing.registeredCount ?? 0
  const max = existing.maxParticipants

  if (max !== null && current >= max) {
    throw createError({ statusCode: 409, message: 'Event is full' })
  }

  const [updated] = await db
    .update(events)
    .set({ registeredCount: sql`${events.registeredCount} + 1` })
    .where(eq(events.id, id))
    .returning({ registeredCount: events.registeredCount })

  if (!updated) {
    throw createError({ statusCode: 500, message: 'Failed to update registration count' })
  }

  return { registeredCount: updated.registeredCount }
})