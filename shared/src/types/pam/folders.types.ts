import { z } from 'zod'

/**
 * PAM Folder Types
 * Shared between frontend and backend
 */

export const FolderSchema = z
	.object({
		id: z.string(),
		orgId: z.string(), // Owner organization
		name: z.string(),
		description: z.string().optional(),
		color: z.string().optional(), // Hex or token for UI accents
		date: z.string().optional(), // ISO 8601 date string - set when exporting documents
		createdAt: z.string(), // ISO 8601 date string
		updatedAt: z.string(), // ISO 8601 date string
		createdBy: z.string().optional(),
		updatedBy: z.string().optional(),
		sharedWith: z.array(z.string()).optional(), // Array of organization IDs this folder is shared with
		locked: z.boolean().optional(), // When true, prevents any mutations to documents in this folder
		lockedBy: z.string().optional(), // User ID who locked the folder
		lockedAt: z.string().optional(), // ISO 8601 date string when folder was locked
	})
	.strict()

export type Folder = z.infer<typeof FolderSchema>
