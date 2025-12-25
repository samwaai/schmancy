/**
 * Hannah Guest Types
 * Guest data for anonymous authenticated users
 */

/**
 * FCM Token stored per device
 * Used for push notifications when browser is closed
 */
export interface HannahFCMToken {
  token: string;
}

/**
 * Guest data stored per anonymous user
 * Collection: hannah database → guests/{uid}
 */
export interface HannahGuest {
  fcmToken?: string;
  orderIds?: string[];  // History of order IDs placed by this guest
}
