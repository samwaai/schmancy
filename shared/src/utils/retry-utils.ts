// retry-utils.ts
import { Observable, throwError, of } from "rxjs";
import { retryWhen, mergeMap, delay } from "rxjs/operators";

/**
 * Checks if an error is a JSON parsing error based on its message.
 * This catches errors like "Expected ',' or '}' after property value in JSON"
 */
export function isJsonParsingError(error: Error): boolean {
  return (
    error.message.includes("JSON") ||
    error.message.includes("Expected") ||
    error.message.includes("Unexpected") ||
    error.message.includes("property value")
  );
}

/**
 * Executes a Firebase function with retry strategy specifically for JSON parsing errors
 *
 * @param asyncFn The Firebase function to execute
 * @param maxRetries Maximum retry attempts (default: 3)
 * @param initialDelay Initial delay in ms before first retry (default: 1000)
 * @returns Promise with the result
 */
export async function retryFirebaseFn<T>(
  asyncFn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> {
  try {
    return await asyncFn();
  } catch (error) {
    if (error instanceof Error && isJsonParsingError(error) && maxRetries > 0) {
      console.warn(
        `Firebase function failed with JSON error: ${error.message}. Retrying...`,
      );

      // Exponential backoff delay
      await new Promise((resolve) => setTimeout(resolve, initialDelay));

      // Recursive retry with one less attempt and increased delay
      return retryFirebaseFn(asyncFn, maxRetries - 1, initialDelay * 2);
    }

    // If it's not a JSON parsing error or no retries left, rethrow
    throw error;
  }
}

/**
 * RxJS operator that adds retry capability specifically for JSON parsing errors
 *
 * @param maxRetries Maximum retry attempts (default: 3)
 * @param initialDelay Initial delay in ms before first retry (default: 1000)
 * @returns Observable operator that handles retries
 */
export function retryWithBackoff<T>(maxRetries = 3, initialDelay = 1000) {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, attempt) => {
            // Only retry for JSON parsing errors and up to maxRetries
            if (
              error instanceof Error &&
              isJsonParsingError(error) &&
              attempt < maxRetries
            ) {
              const retryAttempt = attempt + 1;
              const delay$ = initialDelay * Math.pow(2, attempt);

              console.warn(
                `RxJS stream failed with JSON error: ${error.message}. Retrying (${retryAttempt}/${maxRetries}) in ${delay$}ms...`,
              );

              // Return observable that emits after calculated delay
              return of(null).pipe(delay(delay$));
            }

            // Otherwise, propagate the error
            return throwError(() => error);
          }),
        ),
      ),
    );
  };
}
