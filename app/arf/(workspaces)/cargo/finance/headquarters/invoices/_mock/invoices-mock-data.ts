import type {
  AddPaymentPayload,
  CreateInvoiceRecordPayload,
  InvoicePayment,
  InvoiceRecord,
  InvoiceSummary,
  UpdateInvoiceStatusPayload,
} from "../_types/invoice"
import type { OpenCargoRecord } from "../../../../marketing/customers/[customerId]/_types/financial"
import { prependCustomerInvoice, releaseCustomerOpenCargos } from "../../../../marketing/customers/[customerId]/_mock/financial-mock-data"

const INVOICES_STORAGE_KEY = "arf-headquarters-invoices"
const PAYMENTS_STORAGE_KEY = "arf-headquarters-invoice-payments"

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function cloneInvoice(inv: InvoiceRecord): InvoiceRecord {
  return {
    ...inv,
    relatedCargoIds: [...inv.relatedCargoIds],
    cargoSnapshots: inv.cargoSnapshots?.map((cargo) => ({ ...cargo })),
  }
}

function clonePayment(payment: InvoicePayment): InvoicePayment {
  return { ...payment }
}

function readInvoicesStore(): InvoiceRecord[] {
  if (!canUseStorage()) {
    return invoicesStore.map(cloneInvoice)
  }

  const raw = window.localStorage.getItem(INVOICES_STORAGE_KEY)
  if (!raw) {
    return invoicesStore.map(cloneInvoice)
  }

  try {
    return (JSON.parse(raw) as InvoiceRecord[]).map(cloneInvoice)
  } catch {
    return invoicesStore.map(cloneInvoice)
  }
}

function writeInvoicesStore(next: InvoiceRecord[]): void {
  invoicesStore = next.map(cloneInvoice)
  if (canUseStorage()) {
    window.localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoicesStore))
    window.dispatchEvent(new Event("arf-headquarters-invoices-updated"))
  }
}

function readPaymentsStore(): InvoicePayment[] {
  if (!canUseStorage()) {
    return paymentsStore.map(clonePayment)
  }

  const raw = window.localStorage.getItem(PAYMENTS_STORAGE_KEY)
  if (!raw) {
    return paymentsStore.map(clonePayment)
  }

  try {
    return (JSON.parse(raw) as InvoicePayment[]).map(clonePayment)
  } catch {
    return paymentsStore.map(clonePayment)
  }
}

function writePaymentsStore(next: InvoicePayment[]): void {
  paymentsStore = next.map(clonePayment)
  if (canUseStorage()) {
    window.localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(paymentsStore))
    window.dispatchEvent(new Event("arf-headquarters-invoices-updated"))
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeInvoice(input: Omit<InvoiceRecord, "remainingBalance">): InvoiceRecord {
  return {
    ...input,
    remainingBalance: Math.max(0, input.grandTotal - input.paidTotal),
  }
}

function makePayment(input: InvoicePayment): InvoicePayment {
  return { ...input }
}

// ---------------------------------------------------------------------------
// In-memory payments store
// ---------------------------------------------------------------------------

let paymentsStore: InvoicePayment[] = [
  makePayment({
    id: "pay-1",
    invoiceId: "inv-001",
    paymentDate: "2026-03-20",
    amount: 5900,
    channel: "eft",
    referenceNo: "EFT-2026-0301",
    createdAt: "2026-03-20T10:00:00",
    createdBy: "Derya Aydın",
  }),
  makePayment({
    id: "pay-2",
    invoiceId: "inv-002",
    paymentDate: "2026-03-22",
    amount: 10000,
    channel: "havale",
    referenceNo: "HVL-2026-0322",
    createdAt: "2026-03-22T11:30:00",
    createdBy: "Serkan Demir",
  }),
]

// ---------------------------------------------------------------------------
// In-memory invoices store
// ---------------------------------------------------------------------------

let invoicesStore: InvoiceRecord[] = [
  makeInvoice({
    id: "inv-001",
    invoiceNo: "FTR-2026-0001",
    customerId: "cust-ahmet-karan",
    customerName: "AHMET KARAN",
    customerType: "corporate",
    taxOffice: "Seyhan Vergi Dairesi",
    taxNumber: "11111111111",
    operatingBranchId: "branch-1",
    operatingBranchName: "İstanbul Merkez",
    issueDate: "2026-03-15",
    dueDate: "2026-03-22",
    note: "",
    subTotal: 5000,
    vatTotal: 900,
    grandTotal: 5900,
    paidTotal: 5900,
    status: "odendi",
    statusChangedAt: "2026-03-20T10:05:00",
    statusChangedBy: "Derya Aydın",
    source: "customer-detail",
    relatedCargoIds: ["100021", "100019"],
    relatedCargoCount: 2,
    createdAt: "2026-03-15T09:00:00",
    createdBy: "Derya Aydın",
  }),
  makeInvoice({
    id: "inv-002",
    invoiceNo: "FTR-2026-0002",
    customerId: "cust-toprak",
    customerName: "TPRK SU PLASTİK",
    customerType: "corporate",
    taxOffice: "Onikişubat Vergi Dairesi",
    taxNumber: "12345678901",
    operatingBranchId: "branch-2",
    operatingBranchName: "Ankara Merkez",
    issueDate: "2026-03-18",
    dueDate: "2026-04-01",
    note: "Toplu sevkiyat faturası",
    subTotal: 22000,
    vatTotal: 3960,
    grandTotal: 25960,
    paidTotal: 10000,
    status: "kismi",
    statusChangedAt: "2026-03-22T11:35:00",
    statusChangedBy: "Serkan Demir",
    source: "customer-detail",
    relatedCargoIds: ["shipment-100033", "shipment-100020"],
    relatedCargoCount: 2,
    createdAt: "2026-03-18T10:30:00",
    createdBy: "Serkan Demir",
  }),
  makeInvoice({
    id: "inv-003",
    invoiceNo: "FTR-2026-0003",
    customerId: "cust-arf-tekstil",
    customerName: "ARF TEKSTİL SANAYİ",
    customerType: "individual",
    taxOffice: "",
    taxNumber: "98765432109",
    operatingBranchId: "branch-1",
    operatingBranchName: "İstanbul Merkez",
    issueDate: "2026-03-10",
    dueDate: "2026-03-17",
    note: "",
    subTotal: 8500,
    vatTotal: 1530,
    grandTotal: 10030,
    paidTotal: 0,
    status: "gecikti",
    statusChangedAt: "2026-03-18T00:00:00",
    statusChangedBy: "Sistem",
    source: "customer-detail",
    relatedCargoIds: ["shipment-100012"],
    relatedCargoCount: 1,
    createdAt: "2026-03-10T08:15:00",
    createdBy: "Mevcut Kullanıcı",
  }),
  makeInvoice({
    id: "inv-004",
    invoiceNo: "FTR-2026-0004",
    customerId: "cust-ahmet-karan",
    customerName: "AHMET KARAN",
    customerType: "corporate",
    taxOffice: "Seyhan Vergi Dairesi",
    taxNumber: "11111111111",
    operatingBranchId: "branch-3",
    operatingBranchName: "İzmir Şubesi",
    issueDate: "2026-03-25",
    dueDate: "2026-04-08",
    note: "İzmir bölgesi kargoları",
    subTotal: 14200,
    vatTotal: 2556,
    grandTotal: 16756,
    paidTotal: 0,
    status: "bekliyor",
    statusChangedAt: "2026-03-25T14:00:00",
    statusChangedBy: "Mevcut Kullanıcı",
    source: "customer-detail",
    relatedCargoIds: ["shipment-100050", "shipment-100051", "shipment-100052"],
    relatedCargoCount: 3,
    createdAt: "2026-03-25T14:00:00",
    createdBy: "Mevcut Kullanıcı",
  }),
  makeInvoice({
    id: "inv-005",
    invoiceNo: "FTR-2026-0005",
    customerId: "cust-toprak",
    customerName: "TPRK SU PLASTİK",
    customerType: "corporate",
    taxOffice: "Onikişubat Vergi Dairesi",
    taxNumber: "12345678901",
    operatingBranchId: "branch-2",
    operatingBranchName: "Ankara Merkez",
    issueDate: "2026-03-05",
    dueDate: "2026-03-12",
    note: "",
    subTotal: 6800,
    vatTotal: 1224,
    grandTotal: 8024,
    paidTotal: 0,
    status: "reddedildi",
    statusChangedAt: "2026-03-13T09:20:00",
    statusChangedBy: "Para\u015f\u00FCt Sistem",
    rejectionReason: "Müşteri faturayı e-fatura portalından reddetti",
    source: "customer-detail",
    relatedCargoIds: ["shipment-100030"],
    relatedCargoCount: 1,
    createdAt: "2026-03-05T11:00:00",
    createdBy: "Serkan Demir",
  }),
  makeInvoice({
    id: "inv-006",
    invoiceNo: "FTR-2026-0006",
    customerId: "cust-arf-tekstil",
    customerName: "ARF TEKSTİL SANAYİ",
    customerType: "individual",
    taxOffice: "",
    taxNumber: "98765432109",
    operatingBranchId: "branch-1",
    operatingBranchName: "İstanbul Merkez",
    issueDate: "2026-03-01",
    dueDate: "2026-03-08",
    note: "",
    subTotal: 3200,
    vatTotal: 576,
    grandTotal: 3776,
    paidTotal: 3776,
    status: "iade",
    statusChangedAt: "2026-03-28T16:00:00",
    statusChangedBy: "Mevcut Kullanıcı",
    source: "customer-detail",
    relatedCargoIds: ["shipment-100005"],
    relatedCargoCount: 1,
    createdAt: "2026-03-01T09:30:00",
    createdBy: "Mevcut Kullanıcı",
  }),
  makeInvoice({
    id: "inv-007",
    invoiceNo: "FTR-2026-0007",
    customerId: "cust-toprak",
    customerName: "TPRK SU PLASTİK",
    customerType: "corporate",
    taxOffice: "Onikişubat Vergi Dairesi",
    taxNumber: "12345678901",
    operatingBranchId: "branch-4",
    operatingBranchName: "Bursa Şubesi",
    issueDate: "2026-03-28",
    dueDate: "2026-04-11",
    note: "Bursa teslimatları",
    subTotal: 9600,
    vatTotal: 1728,
    grandTotal: 11328,
    paidTotal: 0,
    status: "bekliyor",
    statusChangedAt: "2026-03-28T08:00:00",
    statusChangedBy: "Mevcut Kullanıcı",
    source: "customer-detail",
    relatedCargoIds: ["shipment-100060", "shipment-100061"],
    relatedCargoCount: 2,
    createdAt: "2026-03-28T08:00:00",
    createdBy: "Mevcut Kullanıcı",
  }),
]

// ---------------------------------------------------------------------------
// Read operations
// ---------------------------------------------------------------------------

export function getInvoicesList(): InvoiceRecord[] {
  return readInvoicesStore().map(cloneInvoice)
}

export function getInvoiceById(id: string): InvoiceRecord | undefined {
  const inv = readInvoicesStore().find((item) => item.id === id)
  if (!inv) return undefined
  return cloneInvoice(inv)
}

export function getPaymentsByInvoiceId(invoiceId: string): InvoicePayment[] {
  return readPaymentsStore().filter((p) => p.invoiceId === invoiceId).map(clonePayment)
}

export function getInvoiceSummary(): InvoiceSummary {
  const today = new Date()
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10)

  let totalAmount = 0
  let totalPaid = 0
  let openBalance = 0
  let overdueBalance = 0
  let thisMonthCount = 0

  for (const inv of readInvoicesStore()) {
    if (inv.status === "iptal") continue
    totalAmount += inv.grandTotal
    totalPaid += inv.paidTotal
    openBalance += inv.remainingBalance
    if (inv.status === "gecikti") overdueBalance += inv.remainingBalance
    if (inv.issueDate >= thisMonthStart) thisMonthCount++
  }

  return { totalAmount, totalPaid, openBalance, overdueBalance, thisMonthCount }
}

// ---------------------------------------------------------------------------
// Write operations
// ---------------------------------------------------------------------------

export function insertInvoice(invoice: InvoiceRecord): InvoiceRecord {
  const clone = cloneInvoice(invoice)
  writeInvoicesStore([clone, ...readInvoicesStore()])
  return clone
}

export function createInvoice(payload: CreateInvoiceRecordPayload): InvoiceRecord {
  const nextSequence = readInvoicesStore().length + 1
  const created = makeInvoice({
    id: `inv-${Date.now()}`,
    invoiceNo: payload.invoiceNo || `FTR-2026-${String(nextSequence).padStart(4, "0")}`,
    customerId: payload.customerId,
    customerName: payload.customerName,
    customerType: payload.customerType,
    taxOffice: payload.taxOffice,
    taxNumber: payload.taxNumber,
    operatingBranchId: payload.operatingBranchId,
    operatingBranchName: payload.operatingBranchName,
    issueDate: payload.issueDate,
    dueDate: payload.dueDate,
    note: payload.note,
    subTotal: payload.subTotal,
    vatTotal: payload.vatTotal,
    grandTotal: payload.grandTotal,
    paidTotal: 0,
    status: "bekliyor",
    statusChangedAt: new Date().toISOString(),
    statusChangedBy: payload.createdBy,
    source: payload.source,
    relatedCargoIds: [...payload.relatedCargoIds],
    cargoSnapshots: payload.cargoSnapshots?.map((cargo) => ({ ...cargo })),
    relatedCargoCount: payload.relatedCargoIds.length,
    createdAt: new Date().toISOString(),
    createdBy: payload.createdBy,
  })

  writeInvoicesStore([created, ...readInvoicesStore()])
  prependCustomerInvoice(payload.customerId, {
    id: `exs-${Date.now()}`,
    type: "fatura",
    invoiceNo: created.invoiceNo,
    dueDate: created.dueDate,
    description: `${created.note || "Yeni fatura"} (${created.relatedCargoCount} kargo)`,
    debit: created.grandTotal,
    credit: 0,
    remainingBalance: created.grandTotal,
    status: "bekliyor",
    relatedCargoCount: created.relatedCargoCount,
    createdAt: created.issueDate,
  })

  return created
}

export function updateInvoiceStatus(
  id: string,
  payload: UpdateInvoiceStatusPayload,
): InvoiceRecord | undefined {
  const currentStore = readInvoicesStore()
  const index = currentStore.findIndex((inv) => inv.id === id)
  if (index === -1) return undefined

  const now = new Date().toISOString()
  const updated: InvoiceRecord = {
    ...currentStore[index],
    relatedCargoIds: [...currentStore[index].relatedCargoIds],
    cargoSnapshots: currentStore[index].cargoSnapshots?.map((cargo) => ({ ...cargo })),
    status: payload.status,
    statusChangedAt: now,
    statusChangedBy: "Mevcut Kullanıcı",
    rejectionReason: payload.reason ?? currentStore[index].rejectionReason,
    parentInvoiceId: payload.parentInvoiceId ?? currentStore[index].parentInvoiceId,
  }

  writeInvoicesStore(currentStore.map((inv, i) => (i === index ? updated : inv)))

  if (["reddedildi", "iade", "iptal"].includes(payload.status) && updated.cargoSnapshots?.length) {
    releaseCustomerOpenCargos(updated.customerId, updated.cargoSnapshots.map((cargo) => ({ ...cargo })) as OpenCargoRecord[])
  }

  return updated
}

export function insertPayment(
  invoiceId: string,
  payload: AddPaymentPayload,
): { payment: InvoicePayment; invoice: InvoiceRecord } | undefined {
  const currentInvoices = readInvoicesStore()
  const currentPayments = readPaymentsStore()
  const invIndex = currentInvoices.findIndex((inv) => inv.id === invoiceId)
  if (invIndex === -1) return undefined

  const payment: InvoicePayment = {
    id: `pay-${Date.now()}`,
    invoiceId,
    paymentDate: payload.paymentDate,
    amount: payload.amount,
    channel: payload.channel,
    referenceNo: payload.referenceNo,
    createdAt: new Date().toISOString(),
    createdBy: "Mevcut Kullanıcı",
  }
  writePaymentsStore([...currentPayments, payment])

  const inv = currentInvoices[invIndex]
  const newPaidTotal = inv.paidTotal + payload.amount
  const newRemaining = Math.max(0, inv.grandTotal - newPaidTotal)
  const newStatus: InvoiceRecord["status"] =
    newRemaining === 0 ? "odendi" : newPaidTotal > 0 ? "kismi" : inv.status

  const updatedInv: InvoiceRecord = {
    ...inv,
    relatedCargoIds: [...inv.relatedCargoIds],
    cargoSnapshots: inv.cargoSnapshots?.map((cargo) => ({ ...cargo })),
    paidTotal: newPaidTotal,
    remainingBalance: newRemaining,
    status: newStatus,
    statusChangedAt: new Date().toISOString(),
    statusChangedBy: "Mevcut Kullanıcı",
  }
  writeInvoicesStore(currentInvoices.map((item, i) => (i === invIndex ? updatedInv : item)))

  return { payment, invoice: updatedInv }
}
