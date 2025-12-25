/**
 * Types for the Invite Employee flow
 * Used to send email invitations with personal links to employees
 */

export interface InviteEmployeeRequest {
  orgId: string
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  organizationName: string
}

export interface InviteEmployeeResponse {
  success: boolean
  message: string
}
