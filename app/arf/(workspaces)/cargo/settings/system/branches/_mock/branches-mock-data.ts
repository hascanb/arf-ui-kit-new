// TODO: Remove when API is ready — replace with real fetch from backend
export interface BranchRecord {
  id: string
  kod: string
  ad: string
  il: string
  ilce: string
  telefon: string
  yetkili: string
  aktif: boolean
}

export const mockBranches: BranchRecord[] = [
  {
    id: "1",
    kod: "IST-001",
    ad: "İstanbul Merkez",
    il: "İstanbul",
    ilce: "Kadıköy",
    telefon: "0216 123 45 67",
    yetkili: "Ali Yılmaz",
    aktif: true,
  },
  {
    id: "2",
    kod: "ANK-001",
    ad: "Ankara Merkez",
    il: "Ankara",
    ilce: "Çankaya",
    telefon: "0312 234 56 78",
    yetkili: "Veli Demir",
    aktif: true,
  },
  {
    id: "3",
    kod: "IZM-001",
    ad: "İzmir Merkez",
    il: "İzmir",
    ilce: "Konak",
    telefon: "0232 345 67 89",
    yetkili: "Ayşe Kaya",
    aktif: true,
  },
  {
    id: "4",
    kod: "IST-002",
    ad: "İstanbul Anadolu",
    il: "İstanbul",
    ilce: "Üsküdar",
    telefon: "0216 456 78 90",
    yetkili: "Mehmet Can",
    aktif: false,
  },
]
