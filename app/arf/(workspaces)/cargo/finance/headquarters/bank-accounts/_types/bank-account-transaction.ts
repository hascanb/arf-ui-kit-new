import type { Currency } from "./bank-account"

export interface BankAccountTransaction {
  id: string
  date: string
  description: string
  amount: number
  balanceAfter: number
  direction: "credit" | "debit"
  currency: Currency
}
