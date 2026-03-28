/**
 * ARF Merkezi Route Haritası
 *
 * Tüm sayfa path'leri bu dosyadan yönetilir.
 * Bir path değiştiğinde sadece burayı güncellemeniz yeterlidir.
 */

const CARGO_BASE = '/arf/cargo'
const AUTH_BASE = '/arf/auth'

export const ARF_ROUTES = {
  /** ARF ana workspace seçim ekranı */
  root: '/arf',

  auth: {
    signIn: `${AUTH_BASE}/signin`,
    signIn2: `${AUTH_BASE}/signin2`,
    signUp: `${AUTH_BASE}/signup`,
    otp: `${AUTH_BASE}/otp`,
    forgotPassword: `${AUTH_BASE}/forgot-password`,
    resetPassword: `${AUTH_BASE}/reset-password`,
  },

  cargo: {
    /** Kargo dashboard (operasyon) */
    root: CARGO_BASE,
    support: `${CARGO_BASE}/support`,

    dashboard: {
      /** Ana kargo dashboard'ı (mevcut ana sayfa) */
      kargo: CARGO_BASE,
      /** Operasyon dashboard'ı */
      operasyon: `${CARGO_BASE}/dashboard/operations`,
      /** Finans dashboard'ı */
      finans: `${CARGO_BASE}/finance`,
      /** Harita dashboard'ı */
      harita: `${CARGO_BASE}/map`,
    },

    shipments: {
      list: `${CARGO_BASE}/shipments`,
      new: `${CARGO_BASE}/shipments/new`,
      track: `${CARGO_BASE}/shipments/track`,
      canceled: `${CARGO_BASE}/shipments/canceled`,
      pieces: `${CARGO_BASE}/shipments/pieces`,
    },

    operations: {
      routes: `${CARGO_BASE}/operations/trips`,
      trips: `${CARGO_BASE}/operations/trips`,
      suppliers: `${CARGO_BASE}/operations/suppliers`,
      lines: `${CARGO_BASE}/operations/lines`,
      ktf: `${CARGO_BASE}/operations/ktf`,
      interlandUnits: `${CARGO_BASE}/operations/interland-units`,
    },

    sales: {
      customers: `${CARGO_BASE}/marketing/customers`,
      contracts: `${CARGO_BASE}/marketing/contracts`,
      priceLists: `${CARGO_BASE}/marketing/price-lists`,
    },

    definitions: {
      suppliers: `${CARGO_BASE}/operations/suppliers`,
      drivers: `${CARGO_BASE}/definitions/drivers`,
      vehicles: `${CARGO_BASE}/definitions/vehicles`,
    },

    finance: {
      branchTransferCenter: {
        root: `${CARGO_BASE}/finance/branch-transfer-center`,
        invoices: `${CARGO_BASE}/finance/branch-transfer-center/invoices`,
        branchCash: `${CARGO_BASE}/finance/branch-transfer-center/branch-cash`,
        branchCashSummary: `${CARGO_BASE}/finance/branch-transfer-center/branch-cash-summary`,
        branchEntitlementDetail: `${CARGO_BASE}/finance/branch-transfer-center/branch-entitlement-detail`,
        transferCenterEntitlementDetail: `${CARGO_BASE}/finance/branch-transfer-center/transfer-center-entitlement-detail`,
      },
      headquarters: {
        root: `${CARGO_BASE}/finance/headquarters`,
        bankAccounts: `${CARGO_BASE}/finance/headquarters/bank-accounts`,
      },
      headOffice: {
        root: `${CARGO_BASE}/finance/head-office`,
        customerCash: `${CARGO_BASE}/finance/head-office/customer-cash`,
        customerCashList: `${CARGO_BASE}/finance/head-office/customer-cash-list`,
        collectionStatement: `${CARGO_BASE}/finance/head-office/collection-statement`,
        branchCashes: `${CARGO_BASE}/finance/head-office/branch-cashes`,
        branchCashLists: `${CARGO_BASE}/finance/head-office/branch-cash-lists`,
        approvalQueue: `${CARGO_BASE}/finance/head-office/approval-queue`,
        branchEntitlementList: `${CARGO_BASE}/finance/head-office/branch-entitlement-list`,
        transferCenterEntitlementList: `${CARGO_BASE}/finance/head-office/transfer-center-entitlement-list`,
      },
    },

    settings: {
      root: `${CARGO_BASE}/settings`,
      roles: `${CARGO_BASE}/settings/system/roles`,
      integrations: `${CARGO_BASE}/settings/system/integrations`,
      system: {
        root: `${CARGO_BASE}/settings/system`,
        roles: `${CARGO_BASE}/settings/system/roles`,
        integrations: `${CARGO_BASE}/settings/system/integrations`,
        transferCenters: `${CARGO_BASE}/settings/system/transfer-centers`,
        branches: `${CARGO_BASE}/settings/system/branches`,
        interlands: `${CARGO_BASE}/settings/system/interlands`,
        blockedInterlands: `${CARGO_BASE}/settings/system/blocked-interlands`,
        bankAccounts: `${CARGO_BASE}/finance/headquarters/bank-accounts`,
        systemPricing: `${CARGO_BASE}/settings/system/system-pricing`,
        lines: `${CARGO_BASE}/settings/system/lines`,
        neighborhoods: `${CARGO_BASE}/settings/system/neighborhoods`,
        distances: `${CARGO_BASE}/settings/system/distance-definitions`,
        users: `${CARGO_BASE}/settings/system/users`,
        permissions: `${CARGO_BASE}/settings/system/permissions`,
      },
      user: {
        root: `${CARGO_BASE}/settings/user`,
        changePassword: `${CARGO_BASE}/settings/user/change-password`,
      },
    },
  },
} as const
