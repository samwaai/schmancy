import { filter, map, startWith, take, tap, timeout } from 'rxjs'
import { isPresent } from 'ts-is-present'
import observeOnMutation from './mutation-observer'

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
  timeoutAfter = 5000,
) {
  return observeOnMutation(document.body).pipe(
    startWith(document.body),
    filter(() => selectors.every(s => !!document.querySelector(s))),
    take(1),
    map(() => selectors.map(s => document.querySelector(s)).filter(isPresent)), // why filter again? see https://github.com/Microsoft/TypeScript/issues/16069
    map(elements => {
      if (elements.length === selectors.length) {
        return elements
      } else {
        throw new Error('Not all elements were found')
      }
    }),
    timeoutAfter ? timeout(timeoutAfter) : tap(),
  )
}
