import { supplierDetailMockData } from "../_mock/supplier-detail-mock-data"
import type { SupplierDetail, SupplierVehicle, SupplierDriver, SupplierDocument } from "../_types"

export async function fetchSupplierDetail(supplierId: string): Promise<SupplierDetail | null> {
  await new Promise((r) => setTimeout(r, 0))
  return supplierDetailMockData[supplierId] ?? null
}

export async function updateSupplierDetail(
  supplierId: string,
  data: Partial<SupplierDetail>,
): Promise<SupplierDetail> {
  await new Promise((r) => setTimeout(r, 0))
  const existing = supplierDetailMockData[supplierId]
  if (!existing) throw new Error("Tedarikçi bulunamadı")
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString().split("T")[0] }
  supplierDetailMockData[supplierId] = updated
  return updated
}

export async function addSupplierVehicle(
  supplierId: string,
  vehicle: Omit<SupplierVehicle, "id">,
): Promise<SupplierVehicle> {
  await new Promise((r) => setTimeout(r, 0))
  const existing = supplierDetailMockData[supplierId]
  if (!existing) throw new Error("Tedarikçi bulunamadı")
  const newVehicle: SupplierVehicle = { ...vehicle, id: `v${Date.now()}` }
  existing.vehicles = [...existing.vehicles, newVehicle]
  existing.vehicleCount = existing.vehicles.length
  return newVehicle
}

export async function addSupplierDriver(
  supplierId: string,
  driver: Omit<SupplierDriver, "id">,
): Promise<SupplierDriver> {
  await new Promise((r) => setTimeout(r, 0))
  const existing = supplierDetailMockData[supplierId]
  if (!existing) throw new Error("Tedarikçi bulunamadı")
  const newDriver: SupplierDriver = { ...driver, id: `d${Date.now()}` }
  existing.drivers = [...existing.drivers, newDriver]
  existing.driverCount = existing.drivers.length
  return newDriver
}

export async function uploadSupplierDocument(
  supplierId: string,
  doc: Omit<SupplierDocument, "id" | "isExpired" | "isExpiringSoon">,
): Promise<SupplierDocument> {
  await new Promise((r) => setTimeout(r, 0))
  const existing = supplierDetailMockData[supplierId]
  if (!existing) throw new Error("Tedarikçi bulunamadı")
  const now = new Date()
  const expiry = doc.expiryDate ? new Date(doc.expiryDate) : null
  const isExpired = expiry ? expiry < now : false
  const thirtyDays = 30 * 24 * 60 * 60 * 1000
  const isExpiringSoon = expiry ? !isExpired && expiry.getTime() - now.getTime() < thirtyDays : false
  const newDoc: SupplierDocument = {
    ...doc,
    id: `doc${Date.now()}`,
    isExpired,
    isExpiringSoon,
  }
  existing.documents = [...existing.documents, newDoc]
  return newDoc
}

export async function toggleSupplierDetailStatus(supplierId: string): Promise<SupplierDetail> {
  await new Promise((r) => setTimeout(r, 0))
  const existing = supplierDetailMockData[supplierId]
  if (!existing) throw new Error("Tedarikçi bulunamadı")
  if (!existing.isDeactivatable) return existing
  existing.status = existing.status === "active" ? "passive" : "active"
  return existing
}
