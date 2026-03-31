import type { TmEntitlementRow, TmEntitlementSummary } from "../_types"

// TODO: Remove when API is ready
const rows: TmEntitlementRow[] = [
  {
    transferCenterId: "tm-istanbul-anadolu",
    transferCenterName: "İstanbul Anadolu TM",
    transferCenterCode: "TM-IST-A01",
    commissionModel: "per_piece",
    commissionValue: 5,
    toplamHakedis: 18500,
    onaylanan: 14300,
    onayBekleyen: 4200,
    iptalEdilen: 1200,
    toplamParcaAdedi: 3700,
    toplamKargoBedeli: 142000,
  },
  {
    transferCenterId: "tm-ankara",
    transferCenterName: "Ankara TM",
    transferCenterCode: "TM-ANK-01",
    commissionModel: "percentage",
    commissionValue: 0.15,
    toplamHakedis: 12300,
    onaylanan: 10500,
    onayBekleyen: 1800,
    iptalEdilen: 800,
    toplamParcaAdedi: 2100,
    toplamKargoBedeli: 82000,
  },
  {
    transferCenterId: "tm-istanbul-avrupa",
    transferCenterName: "İstanbul Avrupa TM",
    transferCenterCode: "TM-IST-E01",
    commissionModel: "per_piece",
    commissionValue: 6,
    toplamHakedis: 24600,
    onaylanan: 19200,
    onayBekleyen: 5400,
    iptalEdilen: 1800,
    toplamParcaAdedi: 4100,
    toplamKargoBedeli: 178000,
  },
  {
    transferCenterId: "tm-izmir",
    transferCenterName: "İzmir TM",
    transferCenterCode: "TM-IZM-01",
    commissionModel: "percentage",
    commissionValue: 0.12,
    toplamHakedis: 9800,
    onaylanan: 7900,
    onayBekleyen: 1900,
    iptalEdilen: 600,
    toplamParcaAdedi: 1650,
    toplamKargoBedeli: 81700,
  },
  {
    transferCenterId: "tm-bursa",
    transferCenterName: "Bursa TM",
    transferCenterCode: "TM-BRS-01",
    commissionModel: "per_piece",
    commissionValue: 4.5,
    toplamHakedis: 7650,
    onaylanan: 6100,
    onayBekleyen: 1550,
    iptalEdilen: 450,
    toplamParcaAdedi: 1700,
    toplamKargoBedeli: 62000,
  },
  {
    transferCenterId: "tm-antalya",
    transferCenterName: "Antalya TM",
    transferCenterCode: "TM-ANT-01",
    commissionModel: "percentage",
    commissionValue: 0.14,
    toplamHakedis: 8400,
    onaylanan: 6800,
    onayBekleyen: 1600,
    iptalEdilen: 500,
    toplamParcaAdedi: 1400,
    toplamKargoBedeli: 60000,
  },
  {
    transferCenterId: "tm-adana",
    transferCenterName: "Adana TM",
    transferCenterCode: "TM-ADN-01",
    commissionModel: "per_piece",
    commissionValue: 4,
    toplamHakedis: 6400,
    onaylanan: 5200,
    onayBekleyen: 1200,
    iptalEdilen: 350,
    toplamParcaAdedi: 1600,
    toplamKargoBedeli: 48000,
  },
  {
    transferCenterId: "tm-konya",
    transferCenterName: "Konya TM",
    transferCenterCode: "TM-KON-01",
    commissionModel: "percentage",
    commissionValue: 0.1,
    toplamHakedis: 5200,
    onaylanan: 4100,
    onayBekleyen: 1100,
    iptalEdilen: 300,
    toplamParcaAdedi: 1050,
    toplamKargoBedeli: 52000,
  },
]

function cloneRow(row: TmEntitlementRow): TmEntitlementRow {
  return { ...row }
}

export function getTmEntitlementRows(): TmEntitlementRow[] {
  return rows.map(cloneRow).sort((a, b) => b.toplamHakedis - a.toplamHakedis)
}

export function getTmEntitlementSummary(): TmEntitlementSummary {
  const totals = rows.reduce(
    (acc, row) => ({
      toplamHakedis: acc.toplamHakedis + row.toplamHakedis,
      parcaBasiToplam: acc.parcaBasiToplam + (row.commissionModel === "per_piece" ? row.toplamHakedis : 0),
      yuzdelikToplam: acc.yuzdelikToplam + (row.commissionModel === "percentage" ? row.toplamHakedis : 0),
      onayBekleyen: acc.onayBekleyen + row.onayBekleyen,
      iptalEdilen: acc.iptalEdilen + row.iptalEdilen,
    }),
    {
      toplamHakedis: 0,
      parcaBasiToplam: 0,
      yuzdelikToplam: 0,
      onayBekleyen: 0,
      iptalEdilen: 0,
    },
  )
  return totals
}
