// src/_shared/firebase-utils.ts
/**
 * Utility functions for working with Firebase
 */

/**
 * Clean an object for Firebase by:
 * - Replacing undefined values with null
 * - Removing functions, symbols, and other non-serializable values
 * - Recursively cleaning nested objects and arrays
 * @param obj The object to clean
 * @returns A new object safe for Firebase storage
 */
export function cleanForFirebase<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return null as T;
  }

  // Filter out non-serializable types
  const type = typeof obj;
  if (type === 'function' || type === 'symbol') {
    return undefined as T; // Will be filtered out by parent
  }

  if (type !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj
      .map(item => cleanForFirebase(item))
      .filter(item => item !== undefined) as unknown as T;
  }

  // Create a new object to ensure we don't modify the original
  const cleanObj: any = {};

  Object.entries(obj).forEach(([key, value]) => {
    // Skip functions and symbols
    const valueType = typeof value;
    if (valueType === 'function' || valueType === 'symbol') {
      return;
    }

    // Skip undefined values
    if (value === undefined) {
      return;
    }

    // Recursively clean objects
    if (value !== null && typeof value === "object") {
      cleanObj[key] = cleanForFirebase(value);
    } else {
      // For primitives, just copy the value
      cleanObj[key] = value;
    }
  });

  return cleanObj as T;
}

/**
 * Prepare a complex object for Firebase storage by converting or removing unsupported values
 * This is a wrapped version that handles exceptions and logs warnings
 * @param data The data to clean
 * @returns A Firebase-safe version of the data
 */
export function safeForFirebase<T>(data: T): T {
  try {
    return cleanForFirebase(data);
  } catch (error) {
    console.warn("Error cleaning data for Firebase:", error);

    // Attempt a simpler approach with JSON conversion if the main approach fails
    try {
      // Convert to JSON and back to strip unsupported values
      return JSON.parse(JSON.stringify(data)) as T;
    } catch (e) {
      console.error("Failed to make data safe for Firebase:", e);
      throw new Error("Cannot prepare data for Firebase storage");
    }
  }
}
