import { pgTable, uuid, varchar, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'

export const events = pgTable('events', {
  id:               uuid('id').primaryKey().defaultRandom(),
  name:             varchar('name', { length: 255 }).notNull(),
  description:      text('description'),
  dates:            jsonb('dates').notNull(), // [{ date: "2026-07-21T17:00:00Z" }, { date: "2026-07-22T18:00:00Z" }]
  location:         varchar('location', { length: 255 }).notNull(),
  maxParticipants:  integer('maxParticipants'),
  registeredCount:  integer('registeredCount').default(0),
  imageUrl:         text('image_url'),
})