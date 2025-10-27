/**
 * @returns An observable that emits the elements when they are found
 * @description This function is useful when you want to wait for multiple elements to appear
 * @example waitForElements(['button', 'input']).subscribe(([button, input]) => button.click())
 * @returns
 */
export default function waitForElements<T extends Array<T>>(
/**
 * @param selectors The selectors to use to find the elements
 * @type { string[] }
 * @description The order of the elements in the array is the same as the order of the elements in the emitted array
 */
selectors: string[], 
/**
 * @param timeoutAfter How long to wait for the elements to appear before throwing an error
 * @default 5000
 * @type { number | undefined }
 * @description If you don't want to wait for the elements to appear, pass `undefined` as the second argument
 */
timeoutAfter?: number): import("rxjs").Observable<Element[]>;
