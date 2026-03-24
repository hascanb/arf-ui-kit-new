import { mockBranches } from "../../branches/_mock/branches-mock-data"
import type { BankAccountAuditLog, BankAccountDetail, BankAccountRecord, BankAccountTransaction } from "../_types"
import type { AccountType, BankAccountStatus, Currency, IntegrationStatus } from "../_types"
import { resolveBankNameByCode } from "./turkey-banks-data"

function getBranchNames(ids: string[]): string[] {
  return ids
    .map((id) => mockBranches.find((branch) => branch.id === id)?.ad)
    .filter((value): value is string => Boolean(value))
}

function cloneAudit(entry: BankAccountAuditLog): BankAccountAuditLog {
  return { ...entry }
}

function cloneTransaction(entry: BankAccountTransaction): BankAccountTransaction {
  return { ...entry }
}

function cloneDetail(detail: BankAccountDetail): BankAccountDetail {
  return {
    ...detail,
    allowedBranchIds: [...detail.allowedBranchIds],
    allowedBranchNames: [...detail.allowedBranchNames],
    auditLogs: detail.auditLogs.map(cloneAudit),
    transactions: detail.transactions.map(cloneTransaction),
  }
}

function toRecord(detail: BankAccountDetail): BankAccountRecord {
  return {
    id: detail.id,
    iban: detail.iban,
    bankCode: detail.bankCode,
    bankName: detail.bankName,
    branchName: detail.branchName,
    currency: detail.currency,
    balance: detail.balance,
    accountHolder: detail.accountHolder,
    label: detail.label,
    accountType: detail.accountType,
    isOpenToAllBranches: detail.isOpenToAllBranches,
    allowedBranchIds: [...detail.allowedBranchIds],
    allowedBranchNames: [...detail.allowedBranchNames],
    integrationStatus: detail.integrationStatus,
    status: detail.status,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    createdBy: detail.createdBy,
    createdByName: detail.createdByName,
  }
}

function makeTransaction(
  id: string,
  date: string,
  description: string,
  amount: number,
  balanceAfter: number,
  direction: "credit" | "debit",
  currency: Currency,
): BankAccountTransaction {
  return { id, date, description, amount, balanceAfter, direction, currency }
}

function makeAudit(
  id: string,
  bankAccountId: string,
  action: BankAccountAuditLog["action"],
  actorName: string,
  previousValue: string | undefined,
  newValue: string,
  timestamp: string,
): BankAccountAuditLog {
  return {
    id,
    bankAccountId,
    action,
    actor: actorName.toLowerCase().replace(/\s+/g, "-"),
    actorName,
    previousValue,
    newValue,
    timestamp,
  }
}

function makeDetail(input: {
  id: string
  iban: string
  branchName: string
  currency: Currency
  balance: number
  accountHolder: string
  label: string
  accountType: AccountType
  isOpenToAllBranches: boolean
  allowedBranchIds: string[]
  integrationStatus: IntegrationStatus
  status: BankAccountStatus
  createdAt: string
  updatedAt: string
  createdByName: string
  transactions: BankAccountTransaction[]
  auditLogs: BankAccountAuditLog[]
}): BankAccountDetail {
  const bankCode = input.iban.slice(4, 9)
  return {
    id: input.id,
    iban: input.iban,
    bankCode,
    bankName: resolveBankNameByCode(bankCode),
    branchName: input.branchName,
    currency: input.currency,
    balance: input.balance,
    accountHolder: input.accountHolder,
    label: input.label,
    accountType: input.accountType,
    isOpenToAllBranches: input.isOpenToAllBranches,
    allowedBranchIds: [...input.allowedBranchIds],
    allowedBranchNames: getBranchNames(input.allowedBranchIds),
    integrationStatus: input.integrationStatus,
    status: input.status,
    createdAt: input.createdAt,
    updatedAt: input.updatedAt,
    createdBy: input.createdByName.toLowerCase().replace(/\s+/g, "-"),
    createdByName: input.createdByName,
    transactions: input.transactions.map(cloneTransaction),
    auditLogs: input.auditLogs.map(cloneAudit),
  }
}

const bankAccountDetailsStore: BankAccountDetail[] = [
  makeDetail({
    id: "ba-1",
    iban: "TR090001061234567890123456",
    branchName: "Kadıköy Şubesi",
    currency: "TRY",
    balance: 1284500.25,
    accountHolder: "ARF Lojistik A.Ş.",
    label: "Ana Kasa Tahsilat",
    accountType: "collection",
    isOpenToAllBranches: true,
    allowedBranchIds: mockBranches.map((branch) => branch.id),
    integrationStatus: "active",
    status: "active",
    createdAt: "2026-03-18T09:00:00",
    updatedAt: "2026-03-22T10:20:00",
    createdByName: "Derya Aydın",
    transactions: [
      makeTransaction("txn-1", "2026-03-22T09:10:00", "İstanbul Merkez günlük tahsilat", 245000, 1284500.25, "credit", "TRY"),
      makeTransaction("txn-2", "2026-03-21T16:30:00", "Ankara Merkez günlük tahsilat", 187250, 1039500.25, "credit", "TRY"),
      makeTransaction("txn-3", "2026-03-21T13:00:00", "Tedarikçi ödeme transferi", 92500, 852250.25, "debit", "TRY"),
    ],
    auditLogs: [
      makeAudit("audit-1", "ba-1", "integration_toggle", "Mevcut Kullanıcı", "Pasif", "Aktif", "2026-03-22T10:20:00"),
      makeAudit("audit-2", "ba-1", "create", "Derya Aydın", undefined, "Banka hesabı oluşturuldu", "2026-03-18T09:00:00"),
    ],
  }),
  makeDetail({
    id: "ba-2",
    iban: "TR250004649876543210987654",
    branchName: "FSM Şubesi",
    currency: "TRY",
    balance: 482300.9,
    accountHolder: "ARF Lojistik A.Ş.",
    label: "Marmara Bölgesi Tahsilatları",
    accountType: "collection",
    isOpenToAllBranches: false,
    allowedBranchIds: ["1", "4"],
    integrationStatus: "active",
    status: "active",
    createdAt: "2026-03-15T08:40:00",
    updatedAt: "2026-03-21T18:15:00",
    createdByName: "Serkan Demir",
    transactions: [
      makeTransaction("txn-4", "2026-03-21T17:45:00", "İstanbul Anadolu toplu tahsilat", 126500, 482300.9, "credit", "TRY"),
      makeTransaction("txn-5", "2026-03-20T11:15:00", "Bursa operasyon gideri", 38500, 355800.9, "debit", "TRY"),
    ],
    auditLogs: [
      makeAudit("audit-3", "ba-2", "branch_scope_update", "Mevcut Kullanıcı", "Tüm şubeler", "İstanbul Merkez, İstanbul Anadolu", "2026-03-21T18:15:00"),
      makeAudit("audit-4", "ba-2", "create", "Serkan Demir", undefined, "Banka hesabı oluşturuldu", "2026-03-15T08:40:00"),
    ],
  }),
  makeDetail({
    id: "ba-3",
    iban: "TR530006281122334455667788",
    branchName: "Konak Şubesi",
    currency: "USD",
    balance: 22480.72,
    accountHolder: "ARF Lojistik A.Ş.",
    label: "İhracat USD Havuzu",
    accountType: "collection",
    isOpenToAllBranches: false,
    allowedBranchIds: ["3"],
    integrationStatus: "passive",
    status: "active",
    createdAt: "2026-03-12T14:20:00",
    updatedAt: "2026-03-20T09:05:00",
    createdByName: "Nazlı Yaman",
    transactions: [
      makeTransaction("txn-6", "2026-03-20T08:20:00", "İzmir Merkez ihracat tahsilatı", 6800, 22480.72, "credit", "USD"),
      makeTransaction("txn-7", "2026-03-18T15:10:00", "Kur farkı düzeltme kaydı", 120.4, 15680.72, "credit", "USD"),
    ],
    auditLogs: [
      makeAudit("audit-5", "ba-3", "integration_toggle", "Mevcut Kullanıcı", "Aktif", "Pasif", "2026-03-20T09:05:00"),
      makeAudit("audit-6", "ba-3", "create", "Nazlı Yaman", undefined, "Banka hesabı oluşturuldu", "2026-03-12T14:20:00"),
    ],
  }),
  makeDetail({
    id: "ba-4",
    iban: "TR860006414433221100998877",
    branchName: "Operasyon Merkezi",
    currency: "EUR",
    balance: 5400.15,
    accountHolder: "ARF Lojistik A.Ş.",
    label: "Genel Merkez Gider Hesabı",
    accountType: "expense",
    isOpenToAllBranches: false,
    allowedBranchIds: [],
    integrationStatus: "passive",
    status: "closed",
    createdAt: "2026-03-05T10:10:00",
    updatedAt: "2026-03-19T16:50:00",
    createdByName: "Ömer Koç",
    transactions: [
      makeTransaction("txn-8", "2026-03-18T09:00:00", "Yurt dışı lisans ödemesi", 820, 5400.15, "debit", "EUR"),
      makeTransaction("txn-9", "2026-03-10T12:30:00", "Hizmet iadesi", 1500, 6220.15, "credit", "EUR"),
    ],
    auditLogs: [
      makeAudit("audit-7", "ba-4", "status_change", "Mevcut Kullanıcı", "Aktif", "Kapalı", "2026-03-19T16:50:00"),
      makeAudit("audit-8", "ba-4", "create", "Ömer Koç", undefined, "Banka hesabı oluşturuldu", "2026-03-05T10:10:00"),
    ],
  }),
]

function sortByUpdatedAt(records: BankAccountRecord[]): BankAccountRecord[] {
  return records.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
}

export function getBankAccountsList(): BankAccountRecord[] {
  return sortByUpdatedAt(bankAccountDetailsStore.map(toRecord))
}

export function getBankAccountDetailById(id: string): BankAccountDetail | undefined {
  const detail = bankAccountDetailsStore.find((item) => item.id === id)
  return detail ? cloneDetail(detail) : undefined
}

export function findBankAccountByIban(iban: string): BankAccountRecord | undefined {
  const cleaned = iban.replace(/\s/g, "").toUpperCase()
  const detail = bankAccountDetailsStore.find((item) => item.iban === cleaned)
  return detail ? toRecord(detail) : undefined
}

interface UpsertBankAccountInput {
  iban: string
  bankName: string
  branchName: string
  currency: Currency
  accountHolder: string
  label: string
  accountType: AccountType
  isOpenToAllBranches: boolean
  allowedBranchIds: string[]
  integrationStatus: IntegrationStatus
}

export function insertBankAccount(input: UpsertBankAccountInput): BankAccountDetail {
  const now = new Date().toISOString()
  const nextId = `ba-${Date.now()}`
  const detail = makeDetail({
    id: nextId,
    iban: input.iban.replace(/\s/g, "").toUpperCase(),
    branchName: input.branchName,
    currency: input.currency,
    balance: 0,
    accountHolder: input.accountHolder,
    label: input.label,
    accountType: input.accountType,
    isOpenToAllBranches: input.isOpenToAllBranches,
    allowedBranchIds: input.allowedBranchIds,
    integrationStatus: input.integrationStatus,
    status: "active",
    createdAt: now,
    updatedAt: now,
    createdByName: "Mevcut Kullanıcı",
    transactions: [],
    auditLogs: [
      makeAudit(`audit-${Date.now()}`, nextId, "create", "Mevcut Kullanıcı", undefined, "Banka hesabı oluşturuldu", now),
    ],
  })

  bankAccountDetailsStore.unshift(detail)
  return cloneDetail(detail)
}

export function updateStoredBankAccount(id: string, input: UpsertBankAccountInput): BankAccountDetail | undefined {
  const detail = bankAccountDetailsStore.find((item) => item.id === id)
  if (!detail) {
    return undefined
  }

  const previousIntegration = detail.integrationStatus
  const previousScope = detail.isOpenToAllBranches ? "Tüm şubeler" : detail.allowedBranchNames.join(", ")
  const nextScope = input.isOpenToAllBranches ? "Tüm şubeler" : getBranchNames(input.allowedBranchIds).join(", ")
  detail.iban = input.iban.replace(/\s/g, "").toUpperCase()
  detail.bankCode = detail.iban.slice(4, 9)
  detail.bankName = input.bankName
  detail.branchName = input.branchName
  detail.currency = input.currency
  detail.accountHolder = input.accountHolder
  detail.label = input.label
  detail.accountType = input.accountType
  detail.isOpenToAllBranches = input.isOpenToAllBranches
  detail.allowedBranchIds = [...input.allowedBranchIds]
  detail.allowedBranchNames = getBranchNames(input.allowedBranchIds)
  detail.integrationStatus = input.integrationStatus
  detail.updatedAt = new Date().toISOString()

  detail.auditLogs.unshift(
    makeAudit(`audit-${Date.now()}`, detail.id, "edit", "Mevcut Kullanıcı", "Banka hesabı alanları", "Banka hesabı bilgileri güncellendi", detail.updatedAt),
  )

  if (previousIntegration !== input.integrationStatus) {
    detail.auditLogs.unshift(
      makeAudit(
        `audit-${Date.now() + 1}`,
        detail.id,
        "integration_toggle",
        "Mevcut Kullanıcı",
        previousIntegration === "active" ? "Aktif" : "Pasif",
        input.integrationStatus === "active" ? "Aktif" : "Pasif",
        detail.updatedAt,
      ),
    )
  }

  if (previousScope !== nextScope) {
    detail.auditLogs.unshift(
      makeAudit(`audit-${Date.now() + 2}`, detail.id, "branch_scope_update", "Mevcut Kullanıcı", previousScope, nextScope || "Genel Merkez", detail.updatedAt),
    )
  }

  return cloneDetail(detail)
}

export function setStoredBankAccountStatus(id: string, status: BankAccountStatus): BankAccountDetail | undefined {
  const detail = bankAccountDetailsStore.find((item) => item.id === id)
  if (!detail) {
    return undefined
  }

  const previousStatus = detail.status
  detail.status = status
  detail.updatedAt = new Date().toISOString()
  detail.auditLogs.unshift(
    makeAudit(
      `audit-${Date.now()}`,
      detail.id,
      "status_change",
      "Mevcut Kullanıcı",
      previousStatus === "active" ? "Kullanımda" : "Kapalı",
      status === "active" ? "Kullanımda" : "Kapalı",
      detail.updatedAt,
    ),
  )

  return cloneDetail(detail)
}
