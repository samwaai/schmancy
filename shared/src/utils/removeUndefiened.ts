/**
 * Recursively removes all undefined values from objects and arrays.
 * Handles nested objects and arrays properly.
 */
export function removeUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => removeUndefinedDeep(item)) as unknown as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val === undefined) continue;
      result[key] = removeUndefinedDeep(val);
    }
    return result as T;
  }

  return value;
}

export default removeUndefinedDeep;
