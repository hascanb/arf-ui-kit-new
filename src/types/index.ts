// Kargo Otomasyon Sistemi - TypeScript Type Definitions

// ==================== ENUMS ====================

export type CargoStatus = 
  | "beklemede"
  | "teslim_alindi"
  | "transfer"
  | "dagitimda"
  | "teslim_edildi"
  | "iade"
  | "iptal";

export type PaymentType = "gonderici_oder" | "alici_oder" | "sozlesmeli";

export type CargoType = "standart" | "express" | "ayni_gun";

export type CustomerType = "bireysel" | "kurumsal";

// ==================== CORE INTERFACES ====================

export interface Address {
  il: string;
  ilce: string;
  mahalle?: string;
  sokak?: string;
  bina_no?: string;
  daire_no?: string;
  posta_kodu?: string;
  adres_tarifi?: string;
}

export interface Customer {
  id: string;
  ad: string;
  soyad?: string;
  firma_adi?: string;
  tip: CustomerType;
  telefon: string;
  email?: string;
  tc_kimlik?: string;
  vergi_no?: string;
  adres: Address;
  created_at: Date;
  updated_at: Date;
}

export interface CargoItem {
  id: string;
  aciklama: string;
  adet: number;
  agirlik: number; // kg
  en?: number; // cm
  boy?: number; // cm
  yukseklik?: number; // cm
  desi?: number; // calculated: (en * boy * yukseklik) / 3000
  birim_fiyat?: number;
}

export interface Branch {
  id: string;
  kod: string;
  ad: string;
  adres: Address;
  telefon: string;
  yetkili?: string;
  aktif: boolean;
}

export interface Cargo {
  id: string;
  takip_no: string;
  barkod: string;
  
  // Sender & Receiver
  gonderen: Customer;
  alici: Customer;
  
  // Branches
  cikis_sube: Branch;
  varis_sube: Branch;
  
  // Cargo Details
  kargo_tipi: CargoType;
  odeme_tipi: PaymentType;
  durum: CargoStatus;
  
  // Items
  parcalar: CargoItem[];
  toplam_adet: number;
  toplam_agirlik: number;
  toplam_desi: number;
  
  // Pricing
  ucret: number;
  kdv: number;
  toplam_ucret: number;
  
  // Additional Info
  aciklama?: string;
  ozel_talimat?: string;
  kapida_odeme_tutari?: number;
  sigorta_bedeli?: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  teslim_tarihi?: Date;
}

// ==================== CARGO MOVEMENT ====================

export interface CargoMovement {
  id: string;
  kargo_id: string;
  durum: CargoStatus;
  sube_id?: string;
  sube_ad?: string;
  aciklama: string;
  personel_id?: string;
  personel_ad?: string;
  tarih: Date;
}

// ==================== USER & AUTH ====================

export interface User {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  rol: "admin" | "sube_yetkilisi" | "kurye" | "musteri_hizmetleri";
  sube_id?: string;
  aktif: boolean;
  avatar?: string;
}

// ==================== REPORTS ====================

export interface DailyStats {
  tarih: Date;
  toplam_kargo: number;
  teslim_edilen: number;
  beklemede: number;
  iade: number;
  toplam_ciro: number;
}

// ==================== FINANCE ====================

export interface Invoice {
  id: string;
  fatura_no: string;
  musteri_id: string;
  tutar: number;
  kdv: number;
  toplam: number;
  durum: "beklemede" | "odendi" | "gecikti" | "iptal";
  vade_tarihi: Date;
  created_at: Date;
}

// ==================== NAVIGATION ====================

export interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
  items?: NavSubItem[];
}

export interface NavSubItem {
  title: string;
  url: string;
  badge?: string | number;
}

// ==================== API RESPONSES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ==================== FORM TYPES ====================

export interface CargoFormData {
  gonderen: Partial<Customer>;
  alici: Partial<Customer>;
  cikis_sube_id: string;
  varis_sube_id: string;
  kargo_tipi: CargoType;
  odeme_tipi: PaymentType;
  parcalar: Omit<CargoItem, "id">[];
  aciklama?: string;
  ozel_talimat?: string;
  kapida_odeme_tutari?: number;
  sigorta_bedeli?: number;
}

export interface CustomerFormData {
  ad: string;
  soyad?: string;
  firma_adi?: string;
  tip: CustomerType;
  telefon: string;
  email?: string;
  tc_kimlik?: string;
  vergi_no?: string;
  adres: Partial<Address>;
}
