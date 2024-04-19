import { createContext } from '@lit/context'
export type TLoginCredentials = {
  email: string
  otp: string
}
export class LoginCredentials implements TLoginCredentials {
  email = ''
  otp = ''
}
export const LoginCredentialsContext = createContext<TLoginCredentials>('logger')
