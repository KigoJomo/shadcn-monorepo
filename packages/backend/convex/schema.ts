import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export const taskFields = {
	title: v.string(),
	description: v.optional(v.string()),
	completed: v.boolean(),
	due_date: v.optional(v.number()),
	updated_at: v.optional(v.number()),
}

export default defineSchema({
	tasks: defineTable(taskFields).index('by_updated_at', ['updated_at']),
})
