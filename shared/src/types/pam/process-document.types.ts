import { z } from 'zod'

export const ProcessDocumentRequestSchema = z
	.object({
		flowId: z.string(),
		documentId: z.string(),
		fileName: z.string(),
		fileType: z.string(),
		orgId: z.string(),
		folderId: z.string().optional(),
		uploadedBy: z.string().optional(),
	})
	.strict()

export type ProcessDocumentRequest = z.infer<typeof ProcessDocumentRequestSchema>

export const ProcessDocumentFlowInputSchema = ProcessDocumentRequestSchema.extend({
	uploadedBy: z.string(),
})

export type ProcessDocumentFlowInput = z.infer<typeof ProcessDocumentFlowInputSchema>

const PROCESS_DOCUMENT_RESPONSE_STATUS = ['success', 'error'] as const

export const ProcessDocumentResponseSchema = z
	.object({
		flowId: z.string(),
		status: z.enum(PROCESS_DOCUMENT_RESPONSE_STATUS),
		documentId: z.string(),
	})
	.strict()

export type ProcessDocumentResponse = z.infer<typeof ProcessDocumentResponseSchema>
