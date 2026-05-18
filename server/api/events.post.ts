import { db } from '../db'
import { events } from '../db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const [newEvent] = await db.insert(events).values({
    name:  body.name,
    description: body.description,
    dates: body.dates,
    location: body.location,
    maxParticipants: body.maxParticipants,
    registeredCount: body.registeredCount,
    imageUrl: body.imageUrl,
  }).returning()
  return newEvent
})