/**
 * Shared file validation utilities
 * Used by both frontend and backend to validate uploaded files
 * Uses file-type library to validate based on magic numbers (file content), not just MIME types
 */

import { fileTypeFromBuffer, fileTypeFromBlob } from 'file-type'

/**
 * Allowed MIME types for invoice documents (validated via magic numbers)
 */
export const ALLOWED_MIME_TYPES = new Set([
	'application/pdf',
	// Images
	'image/jpeg',
	'image/png',
	'image/gif',
	'image/webp',
	'image/svg+xml',
	'image/bmp',
	'image/heic',
	'image/heif',
])

/**
 * Maximum file size in bytes (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024

/**
 * File validation result
 */
export interface FileValidationResult {
	valid: boolean
	error?: string
	detectedMimeType?: string
	detectedExtension?: string
}

/**
 * Validates file size
 * @param size - File size in bytes
 * @returns True if the file size is within limits
 */
export function isValidFileSize(size: number): boolean {
	return size > 0 && size <= MAX_FILE_SIZE
}

/**
 * Validates a file by reading its magic numbers (file signature)
 * This is a SECURE validation that cannot be spoofed by renaming files
 *
 * @param file - File object (browser) or Buffer (Node.js)
 * @returns Validation result with detected MIME type
 */
export async function validateFileByContent(
	file: File | Blob | Buffer | ArrayBuffer | Uint8Array
): Promise<FileValidationResult> {
	try {
		let fileType

		// Handle different input types
		if (file instanceof File || file instanceof Blob) {
			fileType = await fileTypeFromBlob(file)
		} else if (Buffer.isBuffer(file)) {
			fileType = await fileTypeFromBuffer(file)
		} else if (file instanceof ArrayBuffer) {
			fileType = await fileTypeFromBuffer(new Uint8Array(file))
		} else if (file instanceof Uint8Array) {
			fileType = await fileTypeFromBuffer(file)
		} else {
			return {
				valid: false,
				error: 'Unsupported file input type',
			}
		}

		// If file-type cannot detect the type, it might be SVG (text-based)
		if (!fileType) {
			// SVG check (text-based format, no magic number)
			if (file instanceof File || file instanceof Blob) {
				const text = await file.text()
				if (text.trim().startsWith('<svg') || text.includes('xmlns="http://www.w3.org/2000/svg"')) {
					return {
						valid: true,
						detectedMimeType: 'image/svg+xml',
						detectedExtension: 'svg',
					}
				}
			}

			return {
				valid: false,
				error: 'Unable to detect file type. The file may be corrupted or unsupported.',
			}
		}

		// Check if detected MIME type is allowed
		if (!ALLOWED_MIME_TYPES.has(fileType.mime)) {
			return {
				valid: false,
				error: `File type not allowed. Detected: ${fileType.mime}. Only images and PDF files are supported.`,
				detectedMimeType: fileType.mime,
				detectedExtension: fileType.ext,
			}
		}

		return {
			valid: true,
			detectedMimeType: fileType.mime,
			detectedExtension: fileType.ext,
		}
	} catch (error) {
		return {
			valid: false,
			error: `File validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
		}
	}
}

/**
 * Basic file validation (size check only)
 * Use this for quick validation before reading file content
 *
 * @param fileSize - File size in bytes
 * @returns Validation result
 */
export function validateFileSize(fileSize: number): FileValidationResult {
	if (!isValidFileSize(fileSize)) {
		return {
			valid: false,
			error: `File size too large. Maximum allowed size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
		}
	}

	return { valid: true }
}

/**
 * Complete file validation (size + content validation)
 * This is the recommended validation method for security
 *
 * @param file - File object (browser) or Buffer (Node.js)
 * @param fileSize - File size in bytes
 * @returns Validation result
 */
export async function validateFile(
	file: File | Blob | Buffer | ArrayBuffer | Uint8Array,
	fileSize: number
): Promise<FileValidationResult> {
	// First check size
	const sizeValidation = validateFileSize(fileSize)
	if (!sizeValidation.valid) {
		return sizeValidation
	}

	// Then validate content
	return validateFileByContent(file)
}

/**
 * Check if a file is a PDF based on magic numbers
 * @param file - File object or Buffer
 * @returns True if the file is a PDF
 */
export async function isPDF(file: File | Blob | Buffer): Promise<boolean> {
	const result = await validateFileByContent(file)
	return result.valid && result.detectedMimeType === 'application/pdf'
}

/**
 * Check if a file is an image based on magic numbers
 * @param file - File object or Buffer
 * @returns True if the file is an image
 */
export async function isImage(file: File | Blob | Buffer): Promise<boolean> {
	const result = await validateFileByContent(file)
	return result.valid && result.detectedMimeType?.startsWith('image/') === true
}
