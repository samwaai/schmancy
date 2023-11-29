import { Subject, buffer, debounceTime, fromEvent, race, timer } from 'rxjs'
import { SchmancyNotification } from './notification'

export type TNotification = 'success' | 'error' | 'warning' | 'info'
export type TNotificationConfig = {
  action?: typeof Function
  duration?: number
}

function createNotificationComponent(message, type) {
  const notificationComponent = document.createElement('schmancy-notification')
  notificationComponent.setAttribute('type', type)
  notificationComponent.innerHTML = message
  return notificationComponent
}
const $notifications = new Subject<{
  component: SchmancyNotification
  config?: TNotificationConfig
}>()
export const $notify = {
  success: (message: string, config?: TNotificationConfig) => {
    const component = createNotificationComponent(message, 'success')
    $notifications.next({ component, config })
    return component
  },
  error: (message: string, config?: TNotificationConfig) => {
    const component = createNotificationComponent(message, 'error')
    $notifications.next({ component, config })
    return component
  },
  warning: (message: string, config?: TNotificationConfig) => {
    const component = createNotificationComponent(message, 'warning')
    $notifications.next({ component, config })
    return component
  },
  info: (message: string, config?: TNotificationConfig) => {
    const component = createNotificationComponent(message, 'info')
    $notifications.next({ component, config })
    return component
  }
}

$notifications.pipe(buffer($notifications.pipe(debounceTime(1000)))).subscribe((notifications) => {
  if (notifications.length > 1) {
    const notification = notifications[notifications.length - 1]
    $notifications.next({ component: notification.component, config: notification.config })
  }
})
$notifications.subscribe(({ component, config }) => {
  document.body?.appendChild(component)
  race(fromEvent(component, 'close'), timer(config?.duration ?? 3000)).subscribe(() => {
    component.remove()
  })
})
