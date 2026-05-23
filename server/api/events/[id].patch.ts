import { db } from '../../db'
import { events } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }
  
  const body = await readBody(event)

  const [updated] = await db
    .update(events)
    .set({
      name:            body.name,
      description:     body.description,
      date:            new Date(body.date),
      location:        body.location,
      maxParticipants: body.maxParticipants,
      registeredCount: body.registeredCount,
      imageUrl:        body.imageUrl,
    })
    .where(eq(events.id, id))
    .returning()

  return updated
})