/**
 * Permission system with dot notation
 * Format: module.resource.action
 * Examples: owl.orders.read, melanie.employees.create
 */

export interface Permission {
  module: string;
  resource: string;
  action: string;
}

export type PermissionString = string; // e.g., "owl.orders.read"

/**
 * Available modules in the system
 */
export const MODULES = {
  OWL: 'owl',
  MELANIE: 'melanie',
  HANNAH: 'hannah',
  ORGANIZATION: 'organization',
  SETTINGS: 'settings'
} as const;

/**
 * Common actions across all modules
 */
export const ACTIONS = {
  READ: 'read',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // Full access
  EXECUTE: 'execute' // For special operations
} as const;

/**
 * System permissions using app.module.action format
 * Format: app.module.action (e.g., 'owl.orders.view', 'melanie.employees.create')
 */
export const PERMISSIONS = {
  // Owl module - Orders
  'owl.orders.view': 'owl.orders.view',
  'owl.orders.create': 'owl.orders.create',
  'owl.orders.edit': 'owl.orders.edit',
  'owl.orders.delete': 'owl.orders.delete',
  'owl.orders.confirm_delivery': 'owl.orders.confirm_delivery',
  'owl.orders.cancel': 'owl.orders.cancel',

  // Owl module - Transactions (merged with invoices as it's under Transactions in UI)
  'owl.transactions.view': 'owl.transactions.view',
  'owl.transactions.create': 'owl.transactions.create',
  'owl.transactions.edit': 'owl.transactions.edit',
  'owl.transactions.delete': 'owl.transactions.delete',
  'owl.transactions.send_invoice': 'owl.transactions.send_invoice',
  'owl.transactions.mark_paid': 'owl.transactions.mark_paid',

  // Owl module - Items (matches UI navigation "Items")
  'owl.items.view': 'owl.items.view',
  'owl.items.create': 'owl.items.create',
  'owl.items.edit': 'owl.items.edit',
  'owl.items.delete': 'owl.items.delete',
  'owl.items.adjust_stock': 'owl.items.adjust_stock',

  // Owl module - Warehouses
  'owl.warehouses.view': 'owl.warehouses.view',
  'owl.warehouses.create': 'owl.warehouses.create',
  'owl.warehouses.edit': 'owl.warehouses.edit',
  'owl.warehouses.delete': 'owl.warehouses.delete',
  'owl.warehouses.manage': 'owl.warehouses.manage',
  'owl.warehouses.create_orders': 'owl.warehouses.create_orders',
  'owl.warehouses.initialize_inventory': 'owl.warehouses.initialize_inventory',

  // Owl module - Menu (matches UI navigation "Menu")
  'owl.menu.view': 'owl.menu.view',
  'owl.menu.create': 'owl.menu.create',
  'owl.menu.edit': 'owl.menu.edit',
  'owl.menu.delete': 'owl.menu.delete',

  // Owl module - Reports
  'owl.reports.view': 'owl.reports.view',
  'owl.reports.export': 'owl.reports.export',

  // Owl module - System/Admin
  'owl.system.view': 'owl.system.view',
  'owl.system.edit': 'owl.system.edit',
  'owl.system.debug': 'owl.system.debug',
  'owl.system.inventory_timeline': 'owl.system.inventory_timeline',

  // Melanie module - Employees
  'melanie.employees.view': 'melanie.employees.view',
  'melanie.employees.view_salary': 'melanie.employees.view_salary',
  'melanie.employees.edit': 'melanie.employees.edit',
  'melanie.employees.delete': 'melanie.employees.delete',

  // Melanie module - NGTeco Integration
  'melanie.ngteco.sync': 'melanie.ngteco.sync',
  'melanie.ngteco.edit': 'melanie.ngteco.edit',
  'melanie.ngteco.delete': 'melanie.ngteco.delete',
  'melanie.ngteco.register_biometrics': 'melanie.ngteco.register_biometrics',

  // Melanie module - Payments (matches UI navigation "Payments")
  'melanie.payments.view': 'melanie.payments.view',
  'melanie.payments.create': 'melanie.payments.create',
  'melanie.payments.edit': 'melanie.payments.edit',
  'melanie.payments.delete': 'melanie.payments.delete',
  'melanie.payments.approve': 'melanie.payments.approve',
  'melanie.payments.process': 'melanie.payments.process',

  // Melanie module - Attendances (matches UI navigation "Attendances")
  'melanie.attendances.view': 'melanie.attendances.view',
  'melanie.attendances.create': 'melanie.attendances.create',
  'melanie.attendances.edit': 'melanie.attendances.edit',
  'melanie.attendances.delete': 'melanie.attendances.delete',
  'melanie.attendances.approve': 'melanie.attendances.approve',
  'melanie.attendances.qr_view': 'melanie.attendances.qr_view',

  // Melanie module - Business Performance
  'melanie.businesses.view': 'melanie.businesses.view',

  // Melanie module - Restaurants (matches UI navigation "Restaurants")
  'melanie.restaurants.view': 'melanie.restaurants.view',
  'melanie.restaurants.create': 'melanie.restaurants.create',
  'melanie.restaurants.edit': 'melanie.restaurants.edit',
  'melanie.restaurants.delete': 'melanie.restaurants.delete',
  'melanie.restaurants.manage': 'melanie.restaurants.manage',
  'melanie.restaurants.qr': 'melanie.restaurants.qr',

  // Melanie module - Payslips
  'melanie.payslips.view': 'melanie.payslips.view',
  'melanie.payslips.create': 'melanie.payslips.create',
  'melanie.payslips.edit': 'melanie.payslips.edit',
  'melanie.payslips.delete': 'melanie.payslips.delete',
  'melanie.payslips.send': 'melanie.payslips.send',

  // Hannah module - Menu management
  'hannah.menu.view': 'hannah.menu.view',
  'hannah.menu.edit': 'hannah.menu.edit',
  'hannah.menu.delete': 'hannah.menu.delete',
  'hannah.menu.advanced': 'hannah.menu.advanced',

  // Hannah module - Orders
  'hannah.orders.view': 'hannah.orders.view',
  'hannah.orders.manage': 'hannah.orders.manage',

  // Hannah module - Tables
  'hannah.tables.view': 'hannah.tables.view',
  'hannah.tables.manage': 'hannah.tables.manage',

  // Hannah module - Kitchen
  'hannah.kitchen.view': 'hannah.kitchen.view',

  // Hannah module - Ingredients
  'hannah.ingredients.edit': 'hannah.ingredients.edit',

  // PAM module - Payouts
  'pam.payouts.view': 'pam.payouts.view',
  'pam.payouts.create': 'pam.payouts.create',
  'pam.payouts.edit': 'pam.payouts.edit',
  'pam.payouts.delete': 'pam.payouts.delete',
  'pam.payouts.approve': 'pam.payouts.approve',
  'pam.payouts.process': 'pam.payouts.process',
  'pam.payouts.export': 'pam.payouts.export',

  // PAM module - Counterparties
  'pam.counterparties.view': 'pam.counterparties.view',
  'pam.counterparties.create': 'pam.counterparties.create',
  'pam.counterparties.edit': 'pam.counterparties.edit',
  'pam.counterparties.delete': 'pam.counterparties.delete',

  // PAM module - Invoices
  'pam.invoices.view': 'pam.invoices.view',
  'pam.invoices.create': 'pam.invoices.create',
  'pam.invoices.edit': 'pam.invoices.edit',
  'pam.invoices.delete': 'pam.invoices.delete',
  'pam.invoices.send': 'pam.invoices.send',
  'pam.invoices.generate': 'pam.invoices.generate',

  // PAM module - Reports
  'pam.reports.view': 'pam.reports.view',
  'pam.reports.export': 'pam.reports.export',

  // PAM module - Settings
  'pam.settings.view': 'pam.settings.view',
  'pam.settings.edit': 'pam.settings.edit',

  // Organization - Users
  'organization.users.view': 'organization.users.view',
  'organization.users.create': 'organization.users.create',
  'organization.users.edit': 'organization.users.edit',
  'organization.users.delete': 'organization.users.delete',
  'organization.users.invite': 'organization.users.invite',
  'organization.users.suspend': 'organization.users.suspend',

  // Organization - Roles
  'organization.roles.view': 'organization.roles.view',
  'organization.roles.create': 'organization.roles.create',
  'organization.roles.edit': 'organization.roles.edit',
  'organization.roles.delete': 'organization.roles.delete',
  'organization.roles.assign': 'organization.roles.assign',

  // Organization - Settings
  'organization.settings.view': 'organization.settings.view',
  'organization.settings.edit': 'organization.settings.edit',
  'organization.settings.billing': 'organization.settings.billing',
  'organization.settings.integrations': 'organization.settings.integrations',
} as const;

/**
 * Extract app from permission string
 * @param permission Permission string in app.module.action format
 * @returns The app name or null if invalid format
 */
export function getAppFromPermission(permission: string): string | null {
  const parts = permission.split('.')
  return parts.length >= 3 ? parts[0] : null
}

/**
 * Check if user has any permission for a specific app
 * @param app The app to check access for (app id from app-routes.ts)
 * @param permissions Array of user permissions
 * @returns True if user has at least one permission for the app
 */
export function hasAppAccess(app: 'home' | 'owl' | 'melanie' | 'hannah' | 'organization' | 'pam' | 'employee-portal', permissions: string[]): boolean {
  // Check for wildcard permission (owner/admin with all permissions)
  if (permissions.includes('*')) return true

  // Check for permissions with app prefix
  return permissions.some(p => p.startsWith(`${app}.`))
}

/**
 * Dynamically generate permission groups from PERMISSIONS constant
 * Groups permissions by app and module for display purposes
 */
function generatePermissionGroups() {
  const groups: Record<string, Record<string, string[]>> = {}

  // Define app display names
  const appDisplayNames: Record<string, string> = {
    'owl': 'OWL - Inventory Management',
    'melanie': 'Melanie - HR & Payroll',
    'hannah': 'Hannah - Order & Pay',
    'pam': 'PAM - Payment & Accounting',
    'organization': 'Organization Management'
  }

  // Define module display names
  const moduleDisplayNames: Record<string, string> = {
    // OWL modules
    'orders': 'Orders',
    'transactions': 'Transactions',
    'items': 'Items',
    'warehouses': 'Warehouses',
    'menu': 'Menu',
    'reports': 'Reports',
    'system': 'System Administration',
    // Melanie modules
    'employees': 'Employees',
    'payments': 'Payments',
    'attendances': 'Attendances',
    'businesses': 'Business Performance',
    'restaurants': 'Restaurants',
    'payslips': 'Payslips',
    // Hannah modules
    'ingredients': 'Ingredients',
    'tables': 'Tables',
    'kitchen': 'Kitchen',
    // PAM modules
    'payouts': 'Payouts',
    'counterparties': 'Counterparties',
    'invoices': 'Invoices',
    // Organization modules
    'users': 'Users',
    'roles': 'Roles',
    'settings': 'Settings & Integrations'
  }

  // Process each permission
  Object.values(PERMISSIONS).forEach(permission => {
    if (typeof permission !== 'string') return

    const parts = permission.split('.')
    if (parts.length < 3) return // Skip invalid formats

    const [app, module] = parts

    // Determine which app group this belongs to
    let appGroup = appDisplayNames[app]
    if (!appGroup) return // Skip unknown apps

    // Get module display name
    const moduleDisplay = moduleDisplayNames[module] || module

    // Initialize app group if needed
    if (!groups[appGroup]) {
      groups[appGroup] = {}
    }

    // Initialize module group if needed
    if (!groups[appGroup][moduleDisplay]) {
      groups[appGroup][moduleDisplay] = []
    }

    // Add permission to group
    groups[appGroup][moduleDisplay].push(permission)
  })

  // Sort permissions within each group for consistency
  Object.values(groups).forEach(appGroup => {
    Object.keys(appGroup).forEach(module => {
      appGroup[module].sort()
    })
  })

  return groups
}

/**
 * Permission groups organized by application for better clarity
 * Dynamically generated from PERMISSIONS constant
 * Nested structure: App -> Resource -> Permissions
 */
export const PERMISSION_GROUPS_BY_APP = generatePermissionGroups()


/**
 * Generate flattened permission groups for backward compatibility
 */
function generateFlatPermissionGroups() {
  const flatGroups: Record<string, string[]> = {}

  // Flatten the nested structure from PERMISSION_GROUPS_BY_APP
  const nestedGroups = generatePermissionGroups()

  Object.values(nestedGroups).forEach(appGroup => {
    Object.entries(appGroup).forEach(([moduleName, permissions]) => {
      flatGroups[moduleName] = permissions
    })
  })

  return flatGroups
}

/**
 * Flattened permission groups for backward compatibility
 * @deprecated Use PERMISSION_GROUPS_BY_APP for new code
 */
export const PERMISSION_GROUPS = generateFlatPermissionGroups()

/**
 * Permission descriptions for better UX
 */
export const PERMISSION_DESCRIPTIONS: { [key: string]: string } = {
  // OWL - Orders
  'owl.orders.view': 'View and search all orders in the system',
  'owl.orders.create': 'Create new purchase orders and sales orders',
  'owl.orders.edit': 'Modify existing orders including items and quantities',
  'owl.orders.delete': 'Permanently remove orders from the system',
  'owl.orders.confirm_delivery': 'Mark orders as delivered and update inventory',
  'owl.orders.cancel': 'Cancel pending or active orders',

  // OWL - Transactions
  'owl.transactions.view': 'View all transactions and their payment status',
  'owl.transactions.create': 'Create new transactions and invoices',
  'owl.transactions.edit': 'Modify transaction details and amounts',
  'owl.transactions.delete': 'Permanently remove transactions from the system',
  'owl.transactions.send_invoice': 'Send invoices to customers via email',
  'owl.transactions.mark_paid': 'Update transaction payment status to paid',

  // OWL - Items
  'owl.items.view': 'View item catalog and inventory levels',
  'owl.items.create': 'Add new items to the inventory',
  'owl.items.edit': 'Modify item details, prices, and descriptions',
  'owl.items.delete': 'Remove items from the catalog',
  'owl.items.adjust_stock': 'Manually adjust inventory quantities',

  // OWL - Warehouses
  'owl.warehouses.view': 'View warehouse locations and inventory',
  'owl.warehouses.create': 'Create new warehouse locations',
  'owl.warehouses.edit': 'Modify warehouse details and settings',
  'owl.warehouses.delete': 'Remove warehouse locations',
  'owl.warehouses.manage': 'Full warehouse management access',
  'owl.warehouses.create_orders': 'Create and manage orders in warehouses',
  'owl.warehouses.initialize_inventory': 'Create initialization orders and perform inventory adjustments',

  // OWL - Menu
  'owl.menu.view': 'View restaurant menu items and categories',
  'owl.menu.create': 'Add new menu items to the system',
  'owl.menu.edit': 'Update menu item details and prices',
  'owl.menu.delete': 'Remove menu items from the system',

  // OWL - Reports
  'owl.reports.view': 'Access analytics and business reports',
  'owl.reports.export': 'Export reports to PDF, Excel, or CSV formats',

  // OWL - System Administration
  'owl.system.view': 'View system administration and debugging tools',
  'owl.system.edit': 'Modify system settings and perform administrative actions',
  'owl.system.debug': 'Access advanced debugging and troubleshooting features',
  'owl.system.inventory_timeline': 'View and edit inventory transaction timelines',

  // Melanie - Employees
  'melanie.employees.view': 'View employee list with basic information (name, code, profession, location) and hand out profile links',
  'melanie.employees.view_salary': 'View employee salary and payment information (hourly rate, monthly salary, IBAN, BIC)',
  'melanie.employees.edit': 'Create and update employee details, assignments, and basic information',
  'melanie.employees.delete': 'Delete employees from the system',

  // Melanie - NGTeco Integration
  'melanie.ngteco.sync': 'Sync employees with NGTeco devices and read device data',
  'melanie.ngteco.edit': 'Create/update employees on NGTeco devices',
  'melanie.ngteco.delete': 'Delete employees from NGTeco devices',
  'melanie.ngteco.register_biometrics': 'Register fingerprints and face biometrics for employees',

  // Melanie - Payments
  'melanie.payments.view': 'View salary payments and payment history',
  'melanie.payments.create': 'Create new salary payment batches',
  'melanie.payments.edit': 'Modify payment amounts and details',
  'melanie.payments.delete': 'Remove draft or cancelled payments',
  'melanie.payments.approve': 'Approve payments for processing',
  'melanie.payments.process': 'Execute approved payments to employees',

  // Melanie - Attendances
  'melanie.attendances.view': 'View employee attendance records',
  'melanie.attendances.create': 'Create new attendance entries',
  'melanie.attendances.edit': 'Modify attendance records',
  'melanie.attendances.delete': 'Remove attendance entries',
  'melanie.attendances.approve': 'Approve attendance records for payroll',
  'melanie.attendances.qr_view': 'View QR codes for employee check-in/check-out',

  // Melanie - Business Performance
  'melanie.businesses.view': 'View business performance dashboards, sales analytics, labor costs, and employee distribution',

  // Melanie - Restaurants
  'melanie.restaurants.view': 'View restaurant locations and details',
  'melanie.restaurants.create': 'Add new restaurant locations',
  'melanie.restaurants.edit': 'Update restaurant information',
  'melanie.restaurants.delete': 'Remove restaurant locations',
  'melanie.restaurants.manage': 'Full restaurant management access',
  'melanie.restaurants.qr': 'Access QR code check-in functionality for restaurant operations',

  // Melanie - Payslips
  'melanie.payslips.view': 'View employee payslips and history',
  'melanie.payslips.create': 'Generate new payslips for employees',
  'melanie.payslips.edit': 'Modify payslip details and deductions',
  'melanie.payslips.delete': 'Remove draft or incorrect payslips',
  'melanie.payslips.send': 'Send payslips to employees via email',

  // Hannah - Menu management
  'hannah.menu.view': 'View menu items and categories',
  'hannah.menu.edit': 'Create and edit menu items and categories',
  'hannah.menu.delete': 'Delete menu items and categories',
  'hannah.menu.advanced': 'Advanced menu operations (copy menu between businesses, bulk operations)',

  // Hannah - Orders
  'hannah.orders.view': 'View orders',
  'hannah.orders.manage': 'Manage order status (accept, preparing, ready, complete)',

  // Hannah - Tables
  'hannah.tables.view': 'View tables and seating layout',
  'hannah.tables.manage': 'Manage tables and QR codes',

  // Hannah - Kitchen
  'hannah.kitchen.view': 'View kitchen display and order queue (Kitchen Display System)',

  // Hannah - Ingredients
  'hannah.ingredients.edit': 'Manage ingredient library',

  // PAM - Payouts
  'pam.payouts.view': 'View all payouts and payment history',
  'pam.payouts.create': 'Create new payout requests',
  'pam.payouts.edit': 'Modify existing payouts',
  'pam.payouts.delete': 'Remove payouts from system',
  'pam.payouts.approve': 'Approve pending payouts',
  'pam.payouts.process': 'Execute approved payouts',
  'pam.payouts.export': 'Export payout data to CSV or Excel',

  // PAM - Counterparties
  'pam.counterparties.view': 'View supplier and vendor information',
  'pam.counterparties.create': 'Add new counterparties',
  'pam.counterparties.edit': 'Update counterparty details',
  'pam.counterparties.delete': 'Remove counterparties',

  // PAM - Invoices
  'pam.invoices.view': 'View all invoices and their details',
  'pam.invoices.create': 'Create new invoices',
  'pam.invoices.edit': 'Modify existing invoices',
  'pam.invoices.delete': 'Remove invoices from the system',
  'pam.invoices.send': 'Send invoices to recipients via email',
  'pam.invoices.generate': 'Generate PDF invoices',

  // PAM - Reports
  'pam.reports.view': 'Access accounting and payment reports',
  'pam.reports.export': 'Export reports to PDF, Excel, or CSV',

  // PAM - Settings
  'pam.settings.view': 'View PAM settings and configuration',
  'pam.settings.edit': 'Modify PAM settings and preferences',

  // Organization - Users
  'organization.users.view': 'View organization users and their roles',
  'organization.users.create': 'Add new users to the organization',
  'organization.users.edit': 'Update user profiles and permissions',
  'organization.users.delete': 'Remove users from the organization',
  'organization.users.invite': 'Send invitation emails to new users',
  'organization.users.suspend': 'Temporarily suspend user access',

  // Organization - Roles
  'organization.roles.view': 'View available roles and permissions',
  'organization.roles.create': 'Create custom roles with specific permissions',
  'organization.roles.edit': 'Modify role permissions and descriptions',
  'organization.roles.delete': 'Remove custom roles from the system',
  'organization.roles.assign': 'Assign roles to organization users',

  // Organization - Settings
  'organization.settings.view': 'View organization settings and configuration',
  'organization.settings.edit': 'Modify organization details and preferences',
  'organization.settings.billing': 'Manage billing, subscriptions, and payment methods',
  'organization.settings.integrations': 'Configure and manage all third-party integrations (NGTeco, Revolut, Resend, Speedy)',
} as const;
