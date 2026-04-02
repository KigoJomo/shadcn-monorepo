import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { Doc } from './_generated/dataModel'
import { taskFields } from './schema'

export const getAllTasks = query({
	args: {},
	handler: async (ctx) => {
		const allTasks = await ctx.db
			.query('tasks')
			.withIndex('by_updated_at')
			.order('desc')
			.collect()
		return allTasks
	},
})

export const getTask = query({
	args: { id: v.id('tasks') },
	handler: async (ctx, { id }) => {
		const task = await ctx.db.get('tasks', id)

		return task
	},
})

const CreateTaskValidator = {
	title: v.string(),
	description: v.optional(v.string()),
	due_date: v.optional(v.number()),
	updated_at: v.optional(v.number()),
}

export const createTask = mutation({
	args: CreateTaskValidator,
	handler: async (ctx, args) => {
		try {
			await ctx.db.insert('tasks', {
				...args,
				completed: false,
				updated_at: args.updated_at ?? Date.now(),
			})
			return {
				success: 'Task Created Succesfully',
			}
		} catch (error) {
			return {
				error: 'Something went wrong creating the task',
			}
		}
	},
})

const UpdateTaskValidator = {
	id: v.id('tasks'),
	title: v.optional(v.string()),
	description: v.optional(v.string()),
	completed: v.optional(v.boolean()),
	due_date: v.optional(v.number()),
	updated_at: v.optional(v.number()),
}

export const updateTask = mutation({
	args: UpdateTaskValidator,
	handler: async (ctx, args) => {
		const { id, ...updateFields } = args
		const task = await ctx.db.get('tasks', id)

		if (task === null) {
			return {
				error: 'Task Not Found',
			}
		}

		try {
			await ctx.db.patch('tasks', id, { ...updateFields })
			return { success: 'Task Updated Succesfully' }
		} catch (error) {
			return { error: `Something went wrong updating this task: ${error}` }
		}
	},
})

export const deleteTask = mutation({
	args: { id: v.id('tasks') },
	handler: async (ctx, { id }) => {
		const task = await ctx.db.get('tasks', id)
		if (task === null) {
			return { error: 'Task Not Found' }
		}

		try {
			await ctx.db.delete('tasks', id)
			return { success: 'Task Deleted Succesfully' }
		} catch (error) {
			return {
				error: `Something went wrong deleting this task: ${error}`,
			}
		}
	},
})
