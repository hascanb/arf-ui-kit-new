export type UserRole =
  | "superadmin"
  | "hq_manager"
  | "tm_manager"
  | "branch_manager"
  | "courier"
  | "operator"

export type UserStatus = "active" | "passive" | "suspended"

export interface UserRecord {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: UserRole
  locationId: string | null
  locationName: string | null
  locationType: "branch" | "tm" | "hq" | null
  profilePhotoUrl?: string
  status: UserStatus
  lastLogin?: string
  isTemporaryPassword: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
  createdByName: string
}
