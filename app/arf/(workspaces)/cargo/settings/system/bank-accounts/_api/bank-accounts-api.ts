import type { AccountType, BankAccountDetail, BankAccountRecord, Currency, IntegrationStatus } from "../_types"
import {
  findBankAccountByIban,
  getBankAccountsList,
  insertBankAccount,
  setStoredBankAccountStatus,
  updateStoredBankAccount,
} from "../_mock/bank-accounts-mock-data"

export interface UpsertBankAccountPayload {
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

// TODO: Remove mock when API is ready
export async function fetchBankAccounts(): Promise<BankAccountRecord[]> {
  return getBankAccountsList()
}

// TODO: Remove mock when API is ready
export async function createBankAccount(payload: UpsertBankAccountPayload): Promise<BankAccountRecord> {
  const detail = insertBankAccount(payload)
  return detail
}

// TODO: Remove mock when API is ready
export async function updateBankAccount(
  id: string,
  payload: UpsertBankAccountPayload,
): Promise<BankAccountDetail | undefined> {
  return updateStoredBankAccount(id, payload)
}

// TODO: Remove mock when API is ready
export async function setBankAccountStatus(
  id: string,
  status: BankAccountRecord["status"],
): Promise<BankAccountDetail | undefined> {
  return setStoredBankAccountStatus(id, status)
}

// TODO: Remove mock when API is ready
export async function findExistingBankAccountByIban(iban: string): Promise<BankAccountRecord | undefined> {
  return findBankAccountByIban(iban)
}
