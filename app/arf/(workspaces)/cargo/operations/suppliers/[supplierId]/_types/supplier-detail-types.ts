import type { SupplierRecord, SupplierType, SupplierStatus, ContractType } from "../../_types"

// ───────── Araç ─────────
export type VehicleType = "tir" | "kamyon" | "van" | "pickup"
export type VehicleStatus = "idle" | "on_road" | "maintenance"

export interface SupplierVehicle {
  id: string
  plate: string
  brand: string
  model: string
  vehicleType: VehicleType
  year: number
  capacity: number // ton
  status: VehicleStatus
  currentDriverId?: string
  currentDriverName?: string
  lastTrip?: string
  nextInspectionDate?: string
  isInsuranceExpiringSoon?: boolean
}

// ───────── Sürücü ─────────
export type LicenseClass = "B" | "C" | "CE" | "D"
export type DriverStatus = "available" | "on_trip" | "off_duty"

export interface SupplierDriver {
  id: string
  fullName: string
  phone: string
  nationalId: string // TCKN
  licenseClass: LicenseClass
  licenseExpiry: string
  hasSrcCertificate: boolean
  srcExpiryDate?: string
  status: DriverStatus
  activeVehicleId?: string
  activeVehiclePlate?: string
  totalTrips: number
}

// ───────── Evrak ─────────
export type DocumentType =
  | "vergi_levhasi"
  | "imza_sirkuleri"
  | "tasima_sozlesmesi"
  | "k_belgesi"
  | "src_belgesi"
  | "trafik_sigortasi"
  | "kasko"
  | "diger"

export interface SupplierDocument {
  id: string
  documentType: DocumentType
  label: string
  fileUrl?: string
  uploadedAt?: string
  expiryDate?: string
  isExpired: boolean
  isExpiringSoon: boolean
}

// ───────── Tedarikçi Detay ─────────
export interface SupplierDetail extends SupplierRecord {
  // Yasal
  taxOffice?: string
  taxNumber?: string
  officialAddress?: string
  // İletişim
  contactPersonTitle?: string
  contactEmail?: string
  // Banka
  iban?: string
  accountHolder?: string
  // Anlaşma
  paymentTermDays?: number
  pricePerTrip?: number
  pricePerDesi?: number
  // İlişkili listeler
  vehicles: SupplierVehicle[]
  drivers: SupplierDriver[]
  documents: SupplierDocument[]
}

export type { SupplierType, SupplierStatus, ContractType }
