// TODO: Remove when API is ready

import type { FinancialExstreRecord, FinancialKpi, OpenCargoRecord } from "../_types/financial"

const OPEN_CARGOS_STORAGE_KEY = "arf-customer-open-cargos"
const INVOICES_STORAGE_KEY = "arf-customer-financial-invoices"

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function cloneOpenCargo(record: OpenCargoRecord): OpenCargoRecord {
  return { ...record }
}

function cloneInvoice(record: FinancialExstreRecord): FinancialExstreRecord {
  return { ...record }
}

function getBaseOpenCargos(): Record<string, OpenCargoRecord[]> {
  return Object.fromEntries(
    Object.entries(mockOpenCargos).map(([customerId, rows]) => [customerId, rows.map(cloneOpenCargo)]),
  )
}

function getBaseInvoices(): Record<string, FinancialExstreRecord[]> {
  return Object.fromEntries(
    Object.entries(mockInvoices).map(([customerId, rows]) => [customerId, rows.map(cloneInvoice)]),
  )
}

function readStoredMap<T>(storageKey: string, fallback: Record<string, T[]>): Record<string, T[]> {
  if (!canUseStorage()) {
    return fallback
  }

  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as Record<string, T[]>
  } catch {
    return fallback
  }
}

function writeStoredMap<T>(storageKey: string, value: Record<string, T[]>): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value))
  window.dispatchEvent(new Event("arf-customer-financial-updated"))
}

export const mockFinancialKpi: Record<string, FinancialKpi> = {
  "cust-ahmet-karan": {
    openCargoAmount: 0,
    pendingInvoiceDebt: 1910,
    overdueDebt: 930,
    lastCollectionDate: "2026-03-16",
    lastCollectionAmount: 1500,
  },
  "cust-toprak": {
    openCargoAmount: 1210,
    pendingInvoiceDebt: 0,
    overdueDebt: 0,
    lastCollectionDate: "2026-03-13",
    lastCollectionAmount: 2175,
  },
}

export const mockOpenCargos: Record<string, OpenCargoRecord[]> = {
  "cust-ahmet-karan": [],
  "cust-toprak": [
    {
      id: "shipment-100033",
      trackingNo: "ARF-100033",
      date: "2026-03-14 09:18",
      route: "Kahramanmaraş -> Adana",
      status: "hazirlaniyor",
      pieceCount: 3,
      amount: 1210,
      senderCustomerId: "cust-toprak",
      senderCustomer: "TPRK SU PLASTİK",
      senderBranch: "Kahramanmaraş Şube",
      receiverBranch: "Adana Şube",
      receiverCustomer: "Adana Toptan Ltd.",
      receiverPhone: "0322 412 33 10",
      paymentType: "Gönderici Ödemeli",
      invoiceType: "Gönderici",
      baseAmount: 1008.33,
      vat: 201.67,
      volumetricWeight: 9,
      pieceList: "Koli",
      dispatchNo: "IRS-2026-02288",
      atfNo: "",
      arrivalAt: "",
      deliveryAt: "",
      lastActionAt: "2026-03-14 09:18",
      invoiceStatus: "kesilmedi",
      collectionStatus: "beklemede",
      createdBy: "Ali Kaya",
    },
  ],
}

export const mockInvoices: Record<string, FinancialExstreRecord[]> = {
  "cust-ahmet-karan": [
    {
      id: "exs-ahmet-1",
      type: "fatura",
      invoiceNo: "FTR-2026-01521",
      dueDate: "2026-04-15",
      description: "Mart 2. hafta sevkiyat faturası (2 kargo)",
      debit: 4120,
      credit: 0,
      remainingBalance: 4120,
      status: "bekliyor",
      relatedCargoCount: 2,
      createdAt: "2026-03-15",
    },
    {
      id: "exs-ahmet-2",
      type: "gelen_odeme",
      invoiceNo: "THS-2026-00841",
      dueDate: "",
      description: "Kısmi tahsilat – Banka transferi",
      debit: 0,
      credit: 1500,
      remainingBalance: 2620,
      status: "kismi",
      createdAt: "2026-03-16",
    },
    {
      id: "exs-ahmet-3",
      type: "fatura",
      invoiceNo: "FTR-2026-01599",
      dueDate: "2026-03-25",
      description: "Ek teslimat faturası (1 kargo)",
      debit: 3350,
      credit: 0,
      remainingBalance: 5970,
      status: "gecikti",
      relatedCargoCount: 1,
      createdAt: "2026-03-17",
    },
    {
      id: "exs-ahmet-4",
      type: "gelen_odeme",
      invoiceNo: "THS-2026-00910",
      dueDate: "",
      description: "Havale – Garanti Bankası",
      debit: 0,
      credit: 2560,
      remainingBalance: 3410,
      status: "kismi",
      createdAt: "2026-03-22",
    },
    {
      id: "exs-ahmet-5",
      type: "fatura",
      invoiceNo: "FTR-2026-01688",
      dueDate: "2026-04-30",
      description: "Mart 3. hafta sevkiyat faturası (1 kargo)",
      debit: 1500,
      credit: 0,
      remainingBalance: 4910,
      status: "bekliyor",
      relatedCargoCount: 1,
      createdAt: "2026-03-24",
    },
  ],
  "cust-toprak": [
    {
      id: "exs-toprak-1",
      type: "fatura",
      invoiceNo: "FTR-2026-01492",
      dueDate: "2026-04-12",
      description: "Haftalık sevkiyat faturası (1 kargo)",
      debit: 2175,
      credit: 0,
      remainingBalance: 2175,
      status: "odendi",
      relatedCargoCount: 1,
      createdAt: "2026-03-12",
    },
    {
      id: "exs-toprak-2",
      type: "gelen_odeme",
      invoiceNo: "THS-2026-00803",
      dueDate: "",
      description: "Banka transferi",
      debit: 0,
      credit: 2175,
      remainingBalance: 0,
      status: "odendi",
      createdAt: "2026-03-13",
    },
  ],
}

export function getStoredOpenCargos(customerId: string): OpenCargoRecord[] {
  const store = readStoredMap(OPEN_CARGOS_STORAGE_KEY, getBaseOpenCargos())
  return (store[customerId] ?? []).map(cloneOpenCargo)
}

export function getStoredInvoices(customerId: string): FinancialExstreRecord[] {
  const store = readStoredMap(INVOICES_STORAGE_KEY, getBaseInvoices())
  return (store[customerId] ?? []).map(cloneInvoice)
}

export function lockCustomerOpenCargos(customerId: string, cargoIds: string[]): OpenCargoRecord[] {
  const store = readStoredMap(OPEN_CARGOS_STORAGE_KEY, getBaseOpenCargos())
  const current = store[customerId] ?? []
  const next = current.filter((cargo) => !cargoIds.includes(cargo.id))
  store[customerId] = next
  writeStoredMap(OPEN_CARGOS_STORAGE_KEY, store)
  return next.map(cloneOpenCargo)
}

export function releaseCustomerOpenCargos(customerId: string, cargos: OpenCargoRecord[]): OpenCargoRecord[] {
  const store = readStoredMap(OPEN_CARGOS_STORAGE_KEY, getBaseOpenCargos())
  const current = store[customerId] ?? []
  const currentIds = new Set(current.map((cargo) => cargo.id))
  const restored = cargos.filter((cargo) => !currentIds.has(cargo.id)).map(cloneOpenCargo)
  store[customerId] = [...restored, ...current]
  writeStoredMap(OPEN_CARGOS_STORAGE_KEY, store)
  return store[customerId].map(cloneOpenCargo)
}

export function prependCustomerInvoice(customerId: string, invoice: FinancialExstreRecord): FinancialExstreRecord[] {
  const store = readStoredMap(INVOICES_STORAGE_KEY, getBaseInvoices())
  store[customerId] = [cloneInvoice(invoice), ...(store[customerId] ?? [])]
  writeStoredMap(INVOICES_STORAGE_KEY, store)
  return store[customerId].map(cloneInvoice)
}
