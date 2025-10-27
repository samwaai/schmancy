import { filter, startWith, take, timeout } from 'rxjs'
import observeOnMutation from './mutation-observer'

export default function waitUntil(
  selectors: Array<string>,
  timeoutAfter = 5000,
) {
  return observeOnMutation(document.body).pipe(
    startWith(document.body),
    filter(() =>
      selectors.every(selector => !!document.querySelector(selector)),
    ),
    take(1),
    timeout(timeoutAfter),
  )
}
