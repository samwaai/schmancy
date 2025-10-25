export function encodeData(data: string): string {
	return btoa(data)
}

export function decodeData(encodedData: string): string {
	return atob(encodedData)
}
