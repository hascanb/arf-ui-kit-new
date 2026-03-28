export type CustomerType = 'corporate' | 'individual'
export type CustomerStatus = 'active' | 'passive'
export type ShipmentStatus = 'hazirlaniyor' | 'transferde' | 'dagitimda' | 'teslim_edildi' | 'devredildi' | 'iptal'
export type FinancialMovementType = 'fatura' | 'tahsilat' | 'odeme' | 'iade'
export type ContractStatus = 'active' | 'expired' | 'draft'

export interface CustomerAddressRecord {
  id: string
  label: string
  line1: string
  city: string
  district: string
  neighborhood: string
  phone: string
  contactName: string
  branch: string
  isDefault?: boolean
}

export interface CustomerShipmentRecord {
  id: string
  trackingNo: string
  date: string
  route: string
  status: ShipmentStatus
  senderCustomerId?: string
  receiverCustomerId?: string
  pieceCount: number
  amount: number
  // Extended – kargo listesiyle eşleşen alanlar
  senderCustomer?: string
  senderBranch?: string
  receiverBranch?: string
  receiverCustomer?: string
  receiverPhone?: string
  paymentType?: string
  invoiceType?: string
  baseAmount?: number
  vat?: number
  volumetricWeight?: number
  pieceList?: string
  dispatchNo?: string
  atfNo?: string
  arrivalAt?: string
  deliveryAt?: string
  lastActionAt?: string
  pieceStatus?: string
  invoiceStatus?: 'kesildi' | 'kesilmedi'
  collectionStatus?: 'tahsil_edildi' | 'beklemede' | 'iptal'
  createdBy?: string
}

export interface CustomerFinancialMovementRecord {
  id: string
  date: string
  type: FinancialMovementType
  documentNo: string
  description: string
  debit: number
  credit: number
  balance: number
  status: 'on_time' | 'delayed' | 'closed'
}

export interface CustomerContractRecord {
  id: string
  contractNo: string
  documentNo?: string
  type: 'standart' | 'kurumsal' | 'ozel_fiyat'
  startDate: string
  endDate: string
  pricingModel: string
  status: ContractStatus
  note?: string
  attachmentName?: string
}

export interface CustomerDetailRecord {
  id: string
  customerType: CustomerType
  status: CustomerStatus
  tradeName: string
  customerName: string
  taxNumber: string
  taxOffice: string
  tcIdentityNumber?: string
  firstName: string
  lastName: string
  email: string
  contactName: string
  phone: string
  city: string
  district: string
  neighborhood: string
  branch: string
  createdAt: string
  lastShipmentAt?: string
  tags?: string[]
  addresses: CustomerAddressRecord[]
  shipments: CustomerShipmentRecord[]
  financialMovements: CustomerFinancialMovementRecord[]
  contracts: CustomerContractRecord[]
}

export const customerDetails: CustomerDetailRecord[] = [
  {
    id: 'cust-ahmet-karan',
    customerType: 'corporate',
    status: 'active',
    tradeName: 'AHMET KARAN',
    customerName: 'AHMET KARAN',
    taxNumber: '11111111111',
    taxOffice: 'Seyhan Vergi Dairesi',
    firstName: 'Ahmet',
    lastName: 'Karan',
    email: 'ahmet@karan.com.tr',
    contactName: 'Ahmet Karan',
    phone: '0538 691 55 11',
    city: 'Adana',
    district: 'Seyhan',
    neighborhood: 'Alidede',
    branch: 'Adana Şube',
    createdAt: '2025-11-02 09:20',
    lastShipmentAt: '2026-03-15 14:10',
    tags: ['VIP', 'Tahsilat Düzenli'],
    addresses: [
      {
        id: 'addr-ahmet-merkez',
        label: 'Gönderici Merkez Adres',
        line1: 'Alidede Mah. 1185 Sok. No:12 Seyhan/Adana',
        city: 'Adana',
        district: 'Seyhan',
        neighborhood: 'Alidede',
        phone: '0538 691 55 11',
        contactName: 'Ahmet Karan',
        branch: 'Adana Şube',
        isDefault: true,
      },
      {
        id: 'addr-ahmet-depo',
        label: 'Merkez Depo',
        line1: 'Yeşiloba Mah. 1206 Sok. No:3 Seyhan/Adana',
        city: 'Adana',
        district: 'Seyhan',
        neighborhood: 'Yeşiloba',
        phone: '0538 691 55 11',
        contactName: 'Ahmet Karan',
        branch: 'Adana Şube',
      },
    ],
    shipments: [
      {
        id: 'shipment-100021',
        trackingNo: 'ARF-100021',
        date: '2026-03-15 14:10',
        route: 'Adana -> Ankara',
        status: 'dagitimda',
        pieceCount: 4,
        amount: 2480,
        senderCustomerId: 'cust-ahmet-karan',
        senderCustomer: 'AHMET KARAN',
        senderBranch: 'Adana Şube',
        receiverBranch: 'Ankara Şube',
        receiverCustomer: 'Ankara Merkez Ltd.',
        receiverPhone: '0312 441 22 11',
        paymentType: 'Gönderici Ödemeli',
        invoiceType: 'Gönderici',
        baseAmount: 2066.67,
        vat: 413.33,
        volumetricWeight: 12,
        pieceList: 'Koli',
        dispatchNo: 'IRS-2026-02145',
        atfNo: '',
        arrivalAt: '',
        deliveryAt: '',
        lastActionAt: '2026-03-15 14:10',
        invoiceStatus: 'kesildi',
        collectionStatus: 'beklemede',
        createdBy: 'Mehmet Şahin',
      },
      {
        id: 'shipment-100019',
        trackingNo: 'ARF-100019',
        date: '2026-03-13 10:42',
        route: 'Adana -> İzmir',
        status: 'teslim_edildi',
        pieceCount: 2,
        amount: 1640,
        senderCustomerId: 'cust-ahmet-karan',
        senderCustomer: 'AHMET KARAN',
        senderBranch: 'Adana Şube',
        receiverBranch: 'İzmir Şube',
        receiverCustomer: 'İzmir Dağıtım A.Ş.',
        receiverPhone: '0232 333 55 66',
        paymentType: 'Gönderici Ödemeli',
        invoiceType: 'Gönderici',
        baseAmount: 1366.67,
        vat: 273.33,
        volumetricWeight: 6,
        pieceList: 'Koli',
        dispatchNo: 'IRS-2026-02033',
        atfNo: '',
        arrivalAt: '2026-03-14 08:30',
        deliveryAt: '2026-03-14 15:45',
        lastActionAt: '2026-03-14 15:45',
        invoiceStatus: 'kesildi',
        collectionStatus: 'tahsil_edildi',
        createdBy: 'Ayşe Demir',
      },
      {
        id: 'shipment-100012',
        trackingNo: 'ARF-100012',
        date: '2026-03-08 16:25',
        route: 'Adana -> İstanbul',
        status: 'teslim_edildi',
        pieceCount: 6,
        amount: 3350,
        senderCustomerId: 'cust-ahmet-karan',
        senderCustomer: 'AHMET KARAN',
        senderBranch: 'Adana Şube',
        receiverBranch: 'İstanbul Şube',
        receiverCustomer: 'İstanbul Lojistik Ltd.',
        receiverPhone: '0212 555 78 90',
        paymentType: 'Gönderici Ödemeli',
        invoiceType: 'Gönderici',
        baseAmount: 2791.67,
        vat: 558.33,
        volumetricWeight: 18,
        pieceList: 'Koli / Palet',
        dispatchNo: 'IRS-2026-01812',
        atfNo: 'ATF-2026-00211',
        arrivalAt: '2026-03-10 09:15',
        deliveryAt: '2026-03-10 16:30',
        lastActionAt: '2026-03-10 16:30',
        invoiceStatus: 'kesildi',
        collectionStatus: 'tahsil_edildi',
        createdBy: 'Mehmet Şahin',
      },
    ],
    financialMovements: [
      {
        id: 'fin-ahmet-1',
        date: '2026-03-15',
        type: 'fatura',
        documentNo: 'FTR-2026-01521',
        description: 'Mart 2. hafta sevkiyat faturası',
        debit: 2480,
        credit: 0,
        balance: 2480,
        status: 'on_time',
      },
      {
        id: 'fin-ahmet-2',
        date: '2026-03-16',
        type: 'tahsilat',
        documentNo: 'THS-2026-00841',
        description: 'Kısmi tahsilat',
        debit: 0,
        credit: 1500,
        balance: 980,
        status: 'on_time',
      },
      {
        id: 'fin-ahmet-3',
        date: '2026-03-17',
        type: 'fatura',
        documentNo: 'FTR-2026-01599',
        description: 'Ek teslimat faturası',
        debit: 930,
        credit: 0,
        balance: 1910,
        status: 'delayed',
      },
    ],
    contracts: [
      {
        id: 'ctr-ahmet-1',
        contractNo: 'CTR-2026-0007',
        documentNo: 'BLG-2026-0412',
        type: 'kurumsal',
        startDate: '2026-01-01',
        endDate: '2026-12-31 23:59',
        pricingModel: 'Bölgesel desi + kg hibrit',
        status: 'active',
        note: 'Ankara ve İzmir hatlarında özel indirim uygulanır.',
        attachmentName: 'ahmet-karan-sozlesme-2026.pdf',
      },
    ],
  },
  {
    id: 'cust-toprak',
    customerType: 'corporate',
    status: 'active',
    tradeName: 'TPRK SU PLASTİK ',
    customerName: 'TPRK SU PLASTİK ',
    taxNumber: '12345678901',
    taxOffice: 'Onikişubat Vergi Dairesi',
    firstName: 'Mehmet',
    lastName: 'Toprak',
    email: 'operasyon@tprksu.com',
    contactName: 'Mehmet Toprak',
    phone: '0532 456 78 90',
    city: 'Kahramanmaraş',
    district: 'Onikişubat',
    neighborhood: 'Afşar',
    branch: 'Kahramanmaraş Şube',
    createdAt: '2025-08-11 13:12',
    lastShipmentAt: '2026-03-14 09:18',
    tags: ['Kurumsal'],
    addresses: [
      {
        id: 'addr-toprak-fabrika',
        label: 'Alıcı Fabrika Adres',
        line1: 'Afşar Mah. 4032 Sok. No:18 Onikişubat/Kahramanmaraş',
        city: 'Kahramanmaraş',
        district: 'Onikişubat',
        neighborhood: 'Afşar',
        phone: '0532 456 78 90',
        contactName: 'Mehmet Toprak',
        branch: 'Kahramanmaraş Şube',
        isDefault: true,
      },
    ],
    shipments: [
      {
        id: 'shipment-100033',
        trackingNo: 'ARF-100033',
        date: '2026-03-14 09:18',
        route: 'Kahramanmaraş -> Adana',
        status: 'hazirlaniyor',
        pieceCount: 3,
        amount: 1210,
        senderCustomerId: 'cust-toprak',
        senderCustomer: 'TPRK SU PLASTİK',
        senderBranch: 'Kahramanmaraş Şube',
        receiverBranch: 'Adana Şube',
        receiverCustomer: 'Adana Toptan Ltd.',
        receiverPhone: '0322 412 33 10',
        paymentType: 'Gönderici Ödemeli',
        invoiceType: 'Gönderici',
        baseAmount: 1008.33,
        vat: 201.67,
        volumetricWeight: 9,
        pieceList: 'Koli',
        dispatchNo: 'IRS-2026-02288',
        atfNo: '',
        arrivalAt: '',
        deliveryAt: '',
        lastActionAt: '2026-03-14 09:18',
        invoiceStatus: 'kesilmedi',
        collectionStatus: 'beklemede',
        createdBy: 'Ali Kaya',
      },
      {
        id: 'shipment-100020',
        trackingNo: 'ARF-100020',
        date: '2026-03-12 18:05',
        route: 'Kahramanmaraş -> Mersin',
        status: 'transferde',
        pieceCount: 5,
        amount: 2175,
        senderCustomerId: 'cust-toprak',
        senderCustomer: 'TPRK SU PLASTİK',
        senderBranch: 'Kahramanmaraş Şube',
        receiverBranch: 'Mersin Şube',
        receiverCustomer: 'Mersin Gıda A.Ş.',
        receiverPhone: '0324 361 88 44',
        paymentType: 'Gönderici Ödemeli',
        invoiceType: 'Gönderici',
        baseAmount: 1812.50,
        vat: 362.50,
        volumetricWeight: 15,
        pieceList: 'Koli / Çuval',
        dispatchNo: 'IRS-2026-02067',
        atfNo: '',
        arrivalAt: '',
        deliveryAt: '',
        lastActionAt: '2026-03-12 18:05',
        invoiceStatus: 'kesildi',
        collectionStatus: 'beklemede',
        createdBy: 'Ali Kaya',
      },
    ],
    financialMovements: [
      {
        id: 'fin-toprak-1',
        date: '2026-03-12',
        type: 'fatura',
        documentNo: 'FTR-2026-01492',
        description: 'Haftalık sevkiyat faturası',
        debit: 2175,
        credit: 0,
        balance: 2175,
        status: 'on_time',
      },
      {
        id: 'fin-toprak-2',
        date: '2026-03-13',
        type: 'tahsilat',
        documentNo: 'THS-2026-00803',
        description: 'Banka transferi',
        debit: 0,
        credit: 2175,
        balance: 0,
        status: 'closed',
      },
    ],
    contracts: [
      {
        id: 'ctr-toprak-1',
        contractNo: 'CTR-2025-0124',
        documentNo: 'BLG-2025-1881',
        type: 'ozel_fiyat',
        startDate: '2025-10-01',
        endDate: '2026-09-30 23:59',
        pricingModel: 'Hat bazlı sabit fiyat',
        status: 'active',
        note: 'Mersin hattında sabit fiyat uygulanır.',
      },
    ],
  },
  {
    id: 'cust-arf-tekstil',
    customerType: 'individual',
    status: 'passive',
    tradeName: 'ARF TEKSTİL SANAYİ',
    customerName: 'Zeynep Öztürk',
    taxNumber: '98765432109',
    taxOffice: '',
    tcIdentityNumber: '38472910562',
    firstName: 'Zeynep',
    lastName: 'Öztürk',
    email: 'zeynep.ozturk@example.com',
    contactName: 'Zeynep Öztürk',
    phone: '0534 555 34 12',
    city: 'İzmir',
    district: 'Bornova',
    neighborhood: 'Merkez Mahallesi',
    branch: 'İzmir Şube',
    createdAt: '2024-12-21 17:40',
    lastShipmentAt: '2025-10-08 11:22',
    tags: ['Bireysel', 'Pasif'],
    addresses: [
      {
        id: 'addr-zeynep-1',
        label: 'Sevkiyat Noktası',
        line1: 'Merkez Mah. 1234 Sok. No:5 Bornova/İzmir',
        city: 'İzmir',
        district: 'Bornova',
        neighborhood: 'Merkez Mahallesi',
        phone: '0534 555 34 12',
        contactName: 'Zeynep Öztürk',
        branch: 'İzmir Şube',
        isDefault: true,
      },
    ],
    shipments: [
      {
        id: 'shipment-09012',
        trackingNo: 'ARF-09012',
        date: '2025-10-08 11:22',
        route: 'İzmir -> Bursa',
        status: 'teslim_edildi',
        pieceCount: 1,
        amount: 540,
        senderCustomerId: 'cust-arf-tekstil',
        senderCustomer: 'Zeynep Öztürk',
        senderBranch: 'İzmir Şube',
        receiverBranch: 'Bursa Şube',
        receiverCustomer: 'Bursa Tekstil Ltd.',
        receiverPhone: '0224 244 77 88',
        paymentType: 'Gönderici Ödemeli',
        invoiceType: 'Gönderici',
        baseAmount: 450,
        vat: 90,
        volumetricWeight: 3,
        pieceList: 'Koli',
        dispatchNo: 'IRS-2025-09871',
        atfNo: '',
        arrivalAt: '2025-10-09 09:45',
        deliveryAt: '2025-10-09 14:20',
        lastActionAt: '2025-10-09 14:20',
        invoiceStatus: 'kesildi',
        collectionStatus: 'tahsil_edildi',
        createdBy: 'Fatma Yıldız',
      },
    ],
    financialMovements: [
      {
        id: 'fin-zeynep-1',
        date: '2025-10-08',
        type: 'fatura',
        documentNo: 'FTR-2025-10812',
        description: 'Tekil gönderi faturası',
        debit: 540,
        credit: 0,
        balance: 540,
        status: 'closed',
      },
      {
        id: 'fin-zeynep-2',
        date: '2025-10-09',
        type: 'tahsilat',
        documentNo: 'THS-2025-09331',
        description: 'Nakit tahsilat',
        debit: 0,
        credit: 540,
        balance: 0,
        status: 'closed',
      },
    ],
    contracts: [],
  },
]

export const customerListRows = customerDetails.map((customer) => ({
  id: customer.id,
  ad: customer.customerType === 'corporate' ? customer.tradeName : `${customer.firstName} ${customer.lastName}`,
  tip: customer.customerType,
  kimlik_no: customer.customerType === 'corporate' ? customer.taxNumber : customer.tcIdentityNumber || '-',
  telefon: customer.phone,
  email: customer.email,
  durum: customer.status,
  aktif_sozlesme_sayisi: customer.contracts.filter((contract) => contract.status === 'active').length,
  kayit_tarihi: customer.createdAt,
  son_kargo_tarihi: customer.lastShipmentAt || '-',
  kargo_sayisi: customer.shipments.length,
  teslim_edilen_sayisi: customer.shipments.filter((shipment) => shipment.status === 'teslim_edildi').length,
  devir_edilen_sayisi: customer.shipments.filter((shipment) => shipment.status === 'devredildi').length,
  iptal_edilen_sayisi: customer.shipments.filter((shipment) => shipment.status === 'iptal').length,
}))

export type CustomerListRow = (typeof customerListRows)[number]

export const getCustomerById = (customerId: string) =>
  customerDetails.find((customer) => customer.id === customerId)
