import type { TripRecord } from "./trip-types"

export type TripLegStatus = "pending" | "in_progress" | "done"

export type PlannedOperation = "pickup_only" | "dropoff_only" | "pickup_dropoff"

export interface TripLegRecord {
  id: string
  order: number
  locationName: string
  plannedOperation: PlannedOperation
  actualTimestamp?: string
  status: TripLegStatus
}

export interface TripDetailRecord {
  trip: TripRecord
  routeSummary: string
  supplierDisplay: string
  vehicleDisplay: string
  totalWeightKg: number
  legs: TripLegRecord[]
}