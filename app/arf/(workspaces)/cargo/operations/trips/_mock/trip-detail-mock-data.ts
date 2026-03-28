import type { TripDetailRecord } from "../_types"
import { mockTrips } from "./trips-mock-data"

export const mockTripDetailsById: Record<string, TripDetailRecord> = {
  "trip-10000164": {
    trip: mockTrips[0],
    routeSummary: mockTrips[0].lineSummary,
    supplierDisplay: "Lojistik / Merkez Lojistik",
    vehicleDisplay: "21ABR479 - Bedirhan Çalan",
    totalWeightKg: 2860,
    legs: [
      { id: "leg-164-1", order: 1, locationName: "Silopi Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-27T12:10:00.000Z", status: "done" },
      { id: "leg-164-2", order: 2, locationName: "Cizre Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-27T13:18:00.000Z", status: "done" },
      { id: "leg-164-3", order: 3, locationName: "Nusaybin Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-27T14:02:00.000Z", status: "in_progress" },
      { id: "leg-164-4", order: 4, locationName: "Mardin Şb.", plannedOperation: "pickup_dropoff", status: "pending" },
      { id: "leg-164-5", order: 5, locationName: "Diyarbakır T.M.", plannedOperation: "dropoff_only", status: "pending" },
    ],
  },
  "trip-10000165": {
    trip: mockTrips[1],
    routeSummary: mockTrips[1].lineSummary,
    supplierDisplay: "Şirket / Şirket",
    vehicleDisplay: "34LGT813 - Ahmet Can",
    totalWeightKg: 2015,
    legs: [
      { id: "leg-165-1", order: 1, locationName: "Van T.M.", plannedOperation: "pickup_only", status: "pending" },
      { id: "leg-165-2", order: 2, locationName: "Erciş Şb.", plannedOperation: "pickup_dropoff", status: "pending" },
      { id: "leg-165-3", order: 3, locationName: "Patnos Şb.", plannedOperation: "pickup_dropoff", status: "pending" },
      { id: "leg-165-4", order: 4, locationName: "Ağrı Şb.", plannedOperation: "dropoff_only", status: "pending" },
    ],
  },
  "trip-10000166": {
    trip: mockTrips[2],
    routeSummary: mockTrips[2].lineSummary,
    supplierDisplay: "Ambar / Güney Ambar",
    vehicleDisplay: "Plakasız - Sürücüsüz",
    totalWeightKg: 910,
    legs: [
      { id: "leg-166-1", order: 1, locationName: "Mardin Şb.", plannedOperation: "pickup_only", actualTimestamp: "2026-03-27T08:25:00.000Z", status: "done" },
      { id: "leg-166-2", order: 2, locationName: "Midyat Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-27T10:02:00.000Z", status: "done" },
      { id: "leg-166-3", order: 3, locationName: "Nusaybin Şb.", plannedOperation: "dropoff_only", status: "in_progress" },
    ],
  },
  "trip-10000167": {
    trip: mockTrips[3],
    routeSummary: mockTrips[3].lineSummary,
    supplierDisplay: "Kamyon Sahibi / Bedirhan Nakliyat",
    vehicleDisplay: "47BDR001 - Ferhat Şahin",
    totalWeightKg: 2440,
    legs: [
      { id: "leg-167-1", order: 1, locationName: "Silopi Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-26T19:10:00.000Z", status: "done" },
      { id: "leg-167-2", order: 2, locationName: "Cizre Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-26T20:15:00.000Z", status: "done" },
      { id: "leg-167-3", order: 3, locationName: "Nusaybin Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-26T21:22:00.000Z", status: "done" },
      { id: "leg-167-4", order: 4, locationName: "Mardin Şb.", plannedOperation: "pickup_dropoff", actualTimestamp: "2026-03-26T22:40:00.000Z", status: "done" },
      { id: "leg-167-5", order: 5, locationName: "Diyarbakır T.M.", plannedOperation: "dropoff_only", actualTimestamp: "2026-03-26T23:55:00.000Z", status: "done" },
    ],
  },
  "trip-10000168": {
    trip: mockTrips[4],
    routeSummary: mockTrips[4].lineSummary,
    supplierDisplay: "Lojistik / AKSA Lojistik",
    vehicleDisplay: "06MRK248 - Mahmut Yıldız",
    totalWeightKg: 1300,
    legs: [
      { id: "leg-168-1", order: 1, locationName: "Van T.M.", plannedOperation: "pickup_only", actualTimestamp: "2026-03-26T16:25:00.000Z", status: "done" },
      { id: "leg-168-2", order: 2, locationName: "Erciş Şb.", plannedOperation: "pickup_dropoff", status: "pending" },
      { id: "leg-168-3", order: 3, locationName: "Patnos Şb.", plannedOperation: "pickup_dropoff", status: "pending" },
      { id: "leg-168-4", order: 4, locationName: "Ağrı Şb.", plannedOperation: "dropoff_only", status: "pending" },
    ],
  },
}