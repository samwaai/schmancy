import { catchError, filter, map, startWith, take, tap, throwError, timeout } from 'rxjs'
import observeOnMutation from './mutation-observer'

/**
 *
 * @returns An observable that emits the element when it is found
 * @example waitForElement('button').subscribe(button => button.click())
 * @example waitForElement('button', 10000).subscribe(button => button.click())
 * @example waitForElement('button', undefiend).subscribe(button => button.click())
 */
export default function waitForElement<T extends Element>(
  /**
   * @param selector The selector to use to find the element
   * @type { string }
   */
  selector: string,
  /**
   * @param timeoutAfter How long to wait for the element to appear before throwing an error
   * @default 5000
   * @type { number | undefined }
   * @description If you don't want to wait for the element to appear, pass `undefined` as the second argument
   */
  timeoutAfter = 5000,
) {
  return observeOnMutation(document.body).pipe(
    startWith(document.body),
    map(() => document.querySelector<T>(selector)),
    filter(Boolean),
    take(1),
    timeoutAfter ? timeout(timeoutAfter) : tap(),
    catchError(() => throwError(() => 'Selector timeout for ' + selector)),
  )
}
