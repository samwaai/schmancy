// // crypto.ts

// // Fetch the public key from the server or provide it directly
// const publicKeyPem = `-----BEGIN RSA PUBLIC KEY-----
//    MIIBCgKCAQEA3s8FYz/B4z+oPUJ8xQs4JLFnIUkJ69YIGiHgQe1t17cTyLJel7ZY
//    7DOanpKb4YctIzH5XtFUSqz8d+rJWWDb/L+5JfbCI9Us0fNl6Lg4uZwbRFjpnc6K
//    cCq5GB5A16ECMPTPTuJyzLdJjFQDlxIgviq83qK+b6sjDDa0RGU1w/1KY1df6zX5
//    WsJf7vcim19GchxP7JF+SkN7ByV/LyIvHTsVou1KInRlsF1Nz4F+VzL8SgQtJfGC
//    OzM5oBp5lSoRdeh13u3BNpRQF0X7I6FgAx4l67tU55XjB8f3L7XMP2Vw0IeTlUC1
//    ygl0KKvUZc/vERFNWU+wNwdb/MTd6npfJwIDAQAB
//    -----END RSA PUBLIC KEY-----`

// const privateKeyPem = `-----BEGIN RSA PRIVATE KEY-----
//    MIIEowIBAAKCAQEA3s8FYz/B4z+oPUJ8xQs4JLFnIUkJ69YIGiHgQe1t17cTyLJel
//    7ZY7DOanpKb4YctIzH5XtFUSqz8d+rJWWDb/L+5JfbCI9Us0fNl6Lg4uZwbRFjpn
//    c6KcCq5GB5A16ECMPTPTuJyzLdJjFQDlxIgviq83qK+b6sjDDa0RGU1w/1KY1df6
//    zX5WsJf7vcim19GchxP7JF+SkN7ByV/LyIvHTsVou1KInRlsF1Nz4F+VzL8SgQtJ
//    fGCOzM5oBp5lSoRdeh13u3BNpRQF0X7I6FgAx4l67tU55XjB8f3L7XMP2Vw0IeTl
//    UC1ygl0KKvUZc/vERFNWU+wNwdb/MTd6npfJwIDAQABAoIBAG7lNQXj0Mx5JYDa
//    gvF7ICwGQ9yTfiDbQ3zK0F83Jz19x+I0yG8UNq8N3trCpO/sSsvu0lqk2llz3zHN
//    nFfCmMOLu3Jg6akmtZCFfUhjfuFicdgrd8E1/wfnG1Y7P3EjBjLwEzZPGq/RVcc+
//    2U+yr50IrA8j35cJmXt7JAP+Grn5YRCqGNyRJMN8onBGx1zQJfXYs/vLhz/j2pkq
//    KI2R+BMclfrpq1p4NkD1wweh3K9yE4f3YQs5EZhPnHF/qdRkcEwn6MCZctiy29tb
//    9n4ID+HPhZ3yywLs9lJkbA2X9wH7OeK5AtZQ1Xo0ezt+hXJIlx4Bt1Bc7M2+AXqD
//    WIDhMwECgYEA/VBCjuy+jzVb1dRJrF7LLanM/2++UmK5sT1IVqeh5j1Lj2rEiXjl
//    Fq2KFcNkCOqlHgNyRGzL4v80xhTS/Kd2yvGAbxXf9vIq0Xl0nUB9QyXpYNEPC7+A
//    Xv1Jv6zq/JxT0H9HwKtADoqIbR3XsGRb+R4APiLFXa5DqGtTm7A9oZ0CgYEA6W/n
//    5sP8M3nGrX4U0HrAPXYLoiMnxzGMskS1OX1tZl1Dj7mtqB7/5MqvoQHtIymxQmC2
//    Vcv7ixC+jxY7i/+5xVrGo5qJapd/5ht9gAfHZtgcIaZf1KR5nBhS7C+xWZQJ6ohH
//    Eg0SdFqfw7XJQNeL+3Y6MQoL7fbHqjO9EWdgmCECgYBHb0ItMQcPebY1LOg1ljY3
//    /x+Fz4gglYzQyj1EcrNaxjFvgmcVtrtHL2E/dIy9izkqUgfi+5ZbPl+XW1S6tdHu
//    DvZKpIhMLrVXKnBgdSLRYXg/LXt5D84/2bF0rgWY/XShHg8utCwDce6wGzPw4ATb
//    C1X2z0YggX7X+v4/lBStyQKBgQC4wNdWgZj5jMKB6OaVmiIQv4T2t9y8o6GZ+5ns
//    e2bR4vFJZJ5CqF8J6d47OK8+4IJz2F+skm/NN8ELeXaOsRlQlnxG+nFwAZHTU/x7
//    fiUcEfp2M8dzpvhY0eMhVZiWpny7/xuHJG07l7qYGQ7Cyz7eijvR9Y4VP7UfIe4g
//    OHFnrQKBgDg+W3zqgUKj//a0l0MW65KPKXfweZPrDKxuRmuBvf7Fn2p+GbDT/0rU
//    g2sxl2GpxbKHUM7Hw9f+o8Gjo/c6Adt2sOBTQtpHxV6QUb3vmFGwz73MfwRJ23iT
//    QFYGMyvPT+P0M9dID+wTl9gGbwQSZ0RnZcl2LF/gpWTaXjps7Mqt
//    -----END RSA PRIVATE KEY-----`

// const publicKey = await window.crypto.subtle.importKey(
// 	'spki',
// 	new TextEncoder().encode(publicKeyPem),
// 	{
// 		name: 'RSA-OAEP',
// 		hash: 'SHA-256',
// 	},
// 	true,
// 	['encrypt'],
// )

// const privateKey = await window.crypto.subtle.importKey(
// 	'pkcs8',
// 	new TextEncoder().encode(privateKeyPem),
// 	{
// 		name: 'RSA-OAEP',
// 	},
// 	true,
// 	['decrypt'],
// )

// export async function encryptData(data: string): Promise<string> {
// 	const encodedData = new TextEncoder().encode(data)
// 	const encryptedData = await window.crypto.subtle.encrypt(
// 		{
// 			name: 'RSA-OAEP',
// 		},
// 		publicKey,
// 		encodedData,
// 	)

// 	return Array.from(new Uint8Array(encryptedData))
// 		.map(byte => String.fromCharCode(byte))
// 		.join('')
// }

// export async function decryptData(encryptedData: string): Promise<string> {
// 	const encryptedBytes = new Uint8Array(encryptedData.split('').map(char => char.charCodeAt(0)))
// 	const decryptedData = await window.crypto.subtle.decrypt(
// 		{
// 			name: 'RSA-OAEP',
// 		},
// 		privateKey,
// 		encryptedBytes,
// 	)

// 	return new TextDecoder().decode(decryptedData)
// }

// encoder.ts

export function encodeData(data: string): string {
	return btoa(data)
}

export function decodeData(encodedData: string): string {
	return atob(encodedData)
}
