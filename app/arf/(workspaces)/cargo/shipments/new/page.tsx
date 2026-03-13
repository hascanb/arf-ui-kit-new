'use client'

import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable, DataTableColumnHeader } from '@hascanb/arf-ui-kit/datatable-kit'
import { AppHeader } from '@hascanb/arf-ui-kit/layout-kit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSidebar } from '@/components/ui/sidebar'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  ChevronDown,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

type PartySide = 'sender' | 'receiver'
type ModalEntity = 'customer' | 'address'
type ModalMode = 'create' | 'edit'
type FlowSection = 'top' | 'piece' | 'pricing'
type CustomerType = 'corporate' | 'individual'
type CustomerCreateStep = 'type' | 'customer' | 'address'

interface ModalState {
  side: PartySide
  entity: ModalEntity
  mode: ModalMode
  targetId?: string
}

interface CustomerRecord {
  id: string
  customerType: CustomerType
  tradeName: string
  customerName: string
  taxNumber: string
  taxOffice: string
  firstName: string
  lastName: string
  email: string
  contactName: string
  phone: string
  city: string
  district: string
  neighborhood: string
  branch: string
}

interface AddressRecord {
  id: string
  customerId: string
  label: string
  line1: string
  city: string
  district: string
  neighborhood: string
  phone: string
  contactName: string
  branch: string
}

interface ComboboxOption {
  id: string
  label: string
  description?: string
  keywords?: string
}

interface PartyPanelProps {
  title: string
  customerLabel: string
  addressLabel: string
  detailsLabel: string
  emptyHint: string
  customerOptions: ComboboxOption[]
  addressOptions: ComboboxOption[]
  selectedCustomerId: string | null
  selectedAddressId: string | null
  selectedCustomer?: CustomerRecord
  selectedAddress?: AddressRecord
  detailsOpen: boolean
  onCustomerSelect: (value: string) => void
  onAddressSelect: (value: string) => void
  onToggleDetails: () => void
  onCreateCustomer: () => void
  onCreateAddress: () => void
  onEditCustomer: () => void
  onEditAddress: () => void
}

interface PieceFormState {
  pieceType: string
  en: string
  boy: string
  yukseklik: string
  adet: string
  desi: string
  kg: string
  matrah: string
  kdv: string
}

interface PieceRow {
  id: string
  pieceType: string
  adet: number
  desi: number
  totalDesi: number
  kg: number
  totalKg: number
  matrah: number
  kdv: number
  total: number
}

const pieceTypeOptions = [
  { value: 'lastik', label: 'Lastik' },
  { value: 'sandik', label: 'Sandık' },
  { value: 'palet', label: 'Palet' },
  { value: 'koli', label: 'Koli' },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const STANDARD_SECTION_TITLE_CLASS = 'text-[22px] font-semibold tracking-tight text-slate-900'
const STANDARD_INPUT_CLASS = 'h-11 rounded-2xl border-slate-200 bg-white px-4 shadow-sm'
const STANDARD_SELECT_TRIGGER_CLASS = `${STANDARD_INPUT_CLASS} w-full text-left data-[size=default]:h-11`
const STANDARD_PRIMARY_BUTTON_CLASS = 'h-11 rounded-2xl px-5 text-sm font-semibold'

const initialCustomers: CustomerRecord[] = [
  {
    id: 'cust-ahmet-karan',
    customerType: 'corporate',
    tradeName: 'AHMET KARAN',
    customerName: 'AHMET KARAN',
    taxNumber: '11111111111',
    taxOffice: 'Seyhan Vergi Dairesi',
    firstName: 'Ahmet',
    lastName: 'Karan',
    email: '',
    contactName: 'Ahmet Karan',
    phone: '5386915511',
    city: 'Adana',
    district: 'Seyhan',
    neighborhood: 'Alidede',
    branch: 'Adana Şube',
  },
  {
    id: 'cust-toprak',
    customerType: 'corporate',
    tradeName: 'TPRK SU PLASTİK / MEHMET TOPRAK',
    customerName: 'TPRK SU PLASTİK / MEHMET TOPRAK',
    taxNumber: '12345678901',
    taxOffice: 'Onikişubat Vergi Dairesi',
    firstName: 'Mehmet',
    lastName: 'Toprak',
    email: '',
    contactName: 'Mehmet Toprak',
    phone: '5462771640',
    city: 'Kahramanmaraş',
    district: 'Onikişubat',
    neighborhood: 'Afşar',
    branch: 'Gaziantep Şube',
  },
  {
    id: 'cust-arf-tekstil',
    customerType: 'corporate',
    tradeName: 'ARF TEKSTİL SANAYİ',
    customerName: 'ARF TEKSTİL SANAYİ',
    taxNumber: '98765432109',
    taxOffice: 'İkitelli Vergi Dairesi',
    firstName: 'Ayşe',
    lastName: 'Demir',
    email: '',
    contactName: 'Ayşe Demir',
    phone: '5322214411',
    city: 'İstanbul',
    district: 'Başakşehir',
    neighborhood: 'İkitelli OSB',
    branch: 'İkitelli Şube',
  },
]

const cityOptions = ['Adana', 'Ankara', 'İstanbul', 'İzmir', 'Kahramanmaraş', 'Mersin']
const districtOptions = ['Seyhan', 'Çankaya', 'Başakşehir', 'Bornova', 'Onikişubat', 'Akdeniz']
const neighborhoodOptions = ['Alidede', 'Afşar', 'İkitelli OSB', 'Merkez Mahallesi', 'Yeniköy']

const customerCreateSteps = [
  { id: 'type' as CustomerCreateStep, label: 'Tip Seçimi' },
  { id: 'customer' as CustomerCreateStep, label: 'Müşteri Bilgileri' },
  { id: 'address' as CustomerCreateStep, label: 'Adres Bilgileri' },
]

const resolveInterlandBranch = (city: string, district: string, neighborhood: string) => {
  const normalizedCity = city.trim().toLocaleLowerCase('tr-TR')
  const normalizedDistrict = district.trim().toLocaleLowerCase('tr-TR')
  const normalizedNeighborhood = neighborhood.trim().toLocaleLowerCase('tr-TR')

  if (
    normalizedCity === 'istanbul' ||
    normalizedDistrict === 'başakşehir' ||
    normalizedNeighborhood.includes('ikitelli')
  ) {
    return 'İkitelli Şube'
  }

  if (
    normalizedCity === 'kahramanmaraş' ||
    normalizedDistrict === 'onikişubat' ||
    normalizedNeighborhood.includes('afşar')
  ) {
    return 'Gaziantep Şube'
  }

  if (
    normalizedCity === 'adana' ||
    normalizedCity === 'mersin' ||
    normalizedDistrict === 'seyhan' ||
    normalizedDistrict === 'akdeniz' ||
    normalizedNeighborhood.includes('alidede')
  ) {
    return 'Adana Şube'
  }

  return 'Merkez Operasyon'
}

const initialAddresses: AddressRecord[] = [
  {
    id: 'addr-ahmet-merkez',
    customerId: 'cust-ahmet-karan',
    label: 'Gönderici Merkez Adres',
    line1: 'ALİDEDE MAH KARASUKU SOK NO 37 MISIR ÇAR',
    city: 'Adana',
    district: 'Seyhan',
    neighborhood: 'ALİDEDE',
    phone: '5386915511',
    contactName: 'AHMET KAPLAN',
    branch: 'Adana Şube',
  },
  {
    id: 'addr-toprak-fabrika',
    customerId: 'cust-toprak',
    label: 'Alıcı Fabrika Adres',
    line1: 'ADANA ASFALTI CADDESİ NO:27/1',
    city: 'Kahramanmaraş',
    district: 'Onikişubat',
    neighborhood: 'AFŞAR',
    phone: '5462771640',
    contactName: 'Boşaltma Adresi Yetkilisi',
    branch: 'Gaziantep Şube',
  },
  {
    id: 'addr-tekstil-depo',
    customerId: 'cust-arf-tekstil',
    label: 'Merkez Depo',
    line1: 'ORGANİZE SANAYİ 2. CADDE NO:18',
    city: 'İstanbul',
    district: 'Başakşehir',
    neighborhood: 'İkitelli OSB',
    phone: '5322214411',
    contactName: 'Sevkiyat Yetkilisi',
    branch: 'İkitelli Şube',
  },
]

export default function YeniKargoPage() {
  const { state: sidebarState } = useSidebar()
  const pieceSectionRef = useRef<HTMLDivElement | null>(null)
  const pricingSectionRef = useRef<HTMLDivElement | null>(null)
  const [customers, setCustomers] = useState(initialCustomers)
  const [addresses, setAddresses] = useState(initialAddresses)
  const [senderCustomerId, setSenderCustomerId] = useState<string | null>(null)
  const [senderAddressId, setSenderAddressId] = useState<string | null>(null)
  const [receiverCustomerId, setReceiverCustomerId] = useState<string | null>(null)
  const [receiverAddressId, setReceiverAddressId] = useState<string | null>(null)
  const [senderDetailsOpen, setSenderDetailsOpen] = useState(true)
  const [receiverDetailsOpen, setReceiverDetailsOpen] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(undefined)
  const [invoiceTarget, setInvoiceTarget] = useState('sender')
  const [shipmentType, setShipmentType] = useState('standart')
  const [notifyReceiver, setNotifyReceiver] = useState(true)
  const [notifySender, setNotifySender] = useState(true)
  const [waybillNo, setWaybillNo] = useState('')
  const [atfNo, setAtfNo] = useState('')
  const [shippingPrice, setShippingPrice] = useState('0')
  const [cargoNote, setCargoNote] = useState('')
  const [activeSection, setActiveSection] = useState<FlowSection>('top')
  const [modalState, setModalState] = useState<ModalState | null>(null)
  const [customerCreateStep, setCustomerCreateStep] = useState<CustomerCreateStep>('type')
  const [pendingCustomerId, setPendingCustomerId] = useState<string | null>(null)
  const [modalError, setModalError] = useState('')
  const [pieceForm, setPieceForm] = useState<PieceFormState>({
    pieceType: 'lastik',
    en: '0',
    boy: '0',
    yukseklik: '0',
    adet: '1',
    desi: '0',
    kg: '0',
    matrah: '0',
    kdv: '20',
  })
  const [pieceRows, setPieceRows] = useState<PieceRow[]>([
    {
      id: 'piece-initial-1',
      pieceType: 'Sandık',
      adet: 1,
      desi: 2,
      totalDesi: 2,
      kg: 2,
      totalKg: 2,
      matrah: 115.75,
      kdv: 20,
      total: 138.9,
    },
  ])
  const [customerForm, setCustomerForm] = useState({
    customerType: 'corporate' as CustomerType,
    tradeName: '',
    taxNumber: '',
    taxOffice: '',
    tcIdentityNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    contactName: '',
    phone: '',
    city: '',
    district: '',
    neighborhood: '',
    branch: '',
  })
  const [addressForm, setAddressForm] = useState({
    label: '',
    city: '',
    district: '',
    neighborhood: '',
    line1: '',
    contactName: '',
    phone: '',
    branch: '',
  })

  const senderCustomer = customers.find((item) => item.id === senderCustomerId)
  const receiverCustomer = customers.find((item) => item.id === receiverCustomerId)
  const senderAddress = addresses.find((item) => item.id === senderAddressId)
  const receiverAddress = addresses.find((item) => item.id === receiverAddressId)

  const customerOptions = customers.map((item) => ({
    id: item.id,
    label: item.tradeName,
    description:
      item.city && item.branch ? `${item.city} • ${item.branch}` : 'Adres bekleniyor • Şube otomatik atanacak',
    keywords: `${item.tradeName} ${item.contactName} ${item.city} ${item.taxNumber}`,
  }))

  const senderAddressOptions = addresses
    .filter((item) => item.customerId === senderCustomerId)
    .map((item) => ({
      id: item.id,
      label: item.label,
      description: `${item.district} • ${item.branch}`,
      keywords: `${item.label} ${item.line1} ${item.district}`,
    }))

  const receiverAddressOptions = addresses
    .filter((item) => item.customerId === receiverCustomerId)
    .map((item) => ({
      id: item.id,
      label: item.label,
      description: `${item.district} • ${item.branch}`,
      keywords: `${item.label} ${item.line1} ${item.district}`,
    }))

  const openCreateModal = (side: PartySide, entity: ModalEntity) => {
    const selectedCustomer = side === 'sender' ? senderCustomer : receiverCustomer

    setModalState({ side, entity, mode: 'create' })
    setModalError('')

    if (entity === 'customer') {
      setCustomerCreateStep('type')
      setPendingCustomerId(null)
      setCustomerForm({
        customerType: 'corporate',
        tradeName: '',
        taxNumber: '',
        taxOffice: '',
        tcIdentityNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        contactName: '',
        phone: '',
        city: '',
        district: '',
        neighborhood: '',
        branch: '',
      })
      return
    }

    setCustomerCreateStep('address')
    setPendingCustomerId(null)

    setAddressForm({
      label: '',
      city: selectedCustomer?.city || '',
      district: '',
      neighborhood: '',
      line1: '',
      contactName: '',
      phone: selectedCustomer?.phone || '',
      branch: '',
    })
  }

  const openEditModal = (side: PartySide, entity: ModalEntity) => {
    setModalError('')

    if (entity === 'customer') {
      const selectedCustomer = side === 'sender' ? senderCustomer : receiverCustomer

      if (!selectedCustomer) {
        return
      }

      setModalState({ side, entity, mode: 'edit', targetId: selectedCustomer.id })
      setCustomerCreateStep('customer')
      setPendingCustomerId(null)
      setCustomerForm({
        customerType: selectedCustomer.customerType,
        tradeName: selectedCustomer.tradeName,
        taxNumber: selectedCustomer.taxNumber,
        taxOffice: selectedCustomer.taxOffice,
        tcIdentityNumber: selectedCustomer.customerType === 'individual' ? selectedCustomer.taxNumber : '',
        firstName: selectedCustomer.firstName,
        lastName: selectedCustomer.lastName,
        email: selectedCustomer.email,
        contactName: selectedCustomer.contactName,
        phone: selectedCustomer.phone,
        city: selectedCustomer.city,
        district: selectedCustomer.district,
        neighborhood: selectedCustomer.neighborhood,
        branch: selectedCustomer.branch,
      })
      return
    }

    const selectedAddress = side === 'sender' ? senderAddress : receiverAddress

    if (!selectedAddress) {
      return
    }

    setModalState({ side, entity, mode: 'edit', targetId: selectedAddress.id })
    setCustomerCreateStep('address')
    setPendingCustomerId(null)
    setAddressForm({
      label: selectedAddress.label,
      city: selectedAddress.city,
      district: selectedAddress.district,
      neighborhood: selectedAddress.neighborhood,
      line1: selectedAddress.line1,
      contactName: selectedAddress.contactName,
      phone: selectedAddress.phone,
      branch: selectedAddress.branch,
    })
  }

  const closeModal = () => {
    setModalState(null)
    setModalError('')
    setCustomerCreateStep('type')
    setPendingCustomerId(null)
  }

  const getNumber = (value: string, fallback = 0) => {
    const normalized = value.replace(',', '.').trim()
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : fallback
  }

  const formatCurrencyTrailing = (value: number) =>
    `${new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}₺`

  const kdvRate = 20
  const shippingPriceValue = Math.max(0, getNumber(shippingPrice, 0))
  const kdvAmount = Number((shippingPriceValue * (kdvRate / 100)).toFixed(2))
  const grandTotal = Number((shippingPriceValue + kdvAmount).toFixed(2))

  const parsedShippingPrice = Number.parseFloat(shippingPrice.replace(',', '.').trim())
  const hasValidShippingPrice = Number.isFinite(parsedShippingPrice) && parsedShippingPrice >= 0

  const isReadyForSave = Boolean(
    senderCustomerId &&
      senderAddressId &&
      receiverCustomerId &&
      receiverAddressId &&
      paymentMethod &&
      pieceRows.length > 0 &&
      hasValidShippingPrice,
  )

  useEffect(() => {
    const updateActiveSection = () => {
      const activationLine = window.innerHeight * 0.62
      const pieceTop = pieceSectionRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY
      const pricingTop = pricingSectionRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY

      if (pricingTop <= activationLine) {
        setActiveSection('pricing')
        return
      }

      if (pieceTop <= activationLine) {
        setActiveSection('piece')
        return
      }

      setActiveSection('top')
    }

    updateActiveSection()
    requestAnimationFrame(updateActiveSection)
    setTimeout(updateActiveSection, 120)

    window.addEventListener('scroll', updateActiveSection, true)
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection, true)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  const handleAddPiece = () => {
    const adet = Math.max(1, getNumber(pieceForm.adet, 1))
    const en = Math.max(0, getNumber(pieceForm.en, 0))
    const boy = Math.max(0, getNumber(pieceForm.boy, 0))
    const yukseklik = Math.max(0, getNumber(pieceForm.yukseklik, 0))
    const manualDesi = Math.max(0, getNumber(pieceForm.desi, 0))
    const kg = Math.max(0, getNumber(pieceForm.kg, 0))
    const matrah = Math.max(0, getNumber(pieceForm.matrah, 0))
    const kdv = Math.max(0, getNumber(pieceForm.kdv, 20))

    const autoDesi = en > 0 && boy > 0 && yukseklik > 0 ? Number(((en * boy * yukseklik) / 3000).toFixed(2)) : 0
    const desi = manualDesi > 0 ? manualDesi : autoDesi

    const totalDesi = Number((desi * adet).toFixed(2))
    const totalKg = Number((kg * adet).toFixed(2))
    const total = Number((matrah + (matrah * kdv) / 100).toFixed(2))

    const pieceTypeLabel = pieceTypeOptions.find((item) => item.value === pieceForm.pieceType)?.label || pieceForm.pieceType

    const newRow: PieceRow = {
      id: `piece-${Date.now()}`,
      pieceType: pieceTypeLabel,
      adet,
      desi,
      totalDesi,
      kg,
      totalKg,
      matrah,
      kdv,
      total,
    }

    setPieceRows((current) => [...current, newRow])
    setPieceForm((current) => ({
      ...current,
      en: '0',
      boy: '0',
      yukseklik: '0',
      adet: '1',
      desi: '0',
      kg: '0',
      matrah: '0',
    }))
  }

  const scrollToPieceList = () => {
    setActiveSection('piece')
    pieceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToPricing = () => {
    setActiveSection('pricing')
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handlePrimaryAction = () => {
    if (activeSection === 'top') {
      scrollToPieceList()
      return
    }

    if (activeSection === 'piece') {
      scrollToPricing()
      return
    }

    if (!isReadyForSave) {
      return
    }
  }

  const primaryButtonLabel = activeSection === 'pricing' ? 'Kaydet' : 'Devam Et'
  const primaryButtonDisabled = activeSection === 'pricing' ? !isReadyForSave : false

  const numericCellClass = 'text-right tabular-nums'
  const numericHeadClass = 'text-right'

  const pieceColumns = useMemo<ColumnDef<PieceRow>[]>(
    () => [
      {
        accessorKey: 'pieceType',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tür" enableSearch={false} />,
      },
      {
        accessorKey: 'adet',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Adet" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={numericCellClass}>{row.getValue('adet') as number}</span>
        ),
      },
      {
        accessorKey: 'desi',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Desi" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={numericCellClass}>{row.getValue('desi') as number}</span>
        ),
      },
      {
        accessorKey: 'totalDesi',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Toplam Desi" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={numericCellClass}>{row.getValue('totalDesi') as number}</span>
        ),
      },
      {
        accessorKey: 'kg',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Ağırlık" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={numericCellClass}>{row.getValue('kg') as number}</span>
        ),
      },
      {
        accessorKey: 'totalKg',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Toplam Ağırlık" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={numericCellClass}>{row.getValue('totalKg') as number}</span>
        ),
      },
      {
        accessorKey: 'matrah',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Matrah (Fiyat)" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={`${numericCellClass} font-semibold text-slate-700`}>
            {formatCurrency(row.getValue('matrah'))}
          </span>
        ),
      },
      {
        accessorKey: 'kdv',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="KDV" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={`${numericCellClass} text-slate-500`}>%{row.getValue('kdv') as number}</span>
        ),
      },
      {
        accessorKey: 'total',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Toplam" className={numericHeadClass} enableSearch={false} />
        ),
        cell: ({ row }) => (
          <span className={`${numericCellClass} font-semibold text-indigo-600`}>
            {formatCurrency(row.getValue('total'))}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'İşlemler',
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setPieceRows((current) => current.filter((item) => item.id !== row.original.id))}
              className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    [setPieceRows],
  )

  const saveModal = () => {
    if (!modalState) {
      return
    }

    if (modalState.entity === 'customer' && !(modalState.mode === 'create' && customerCreateStep === 'address')) {
      if (modalState.mode === 'create' && customerCreateStep === 'type') {
        setCustomerCreateStep('customer')
        setModalError('')
        return
      }

      const isCorporate = customerForm.customerType === 'corporate'
      const companyName = customerForm.tradeName.trim()
      const taxNumber = customerForm.taxNumber.trim()
      const taxOffice = customerForm.taxOffice.trim()
      const tcIdentityNumber = customerForm.tcIdentityNumber.trim()
      const firstName = customerForm.firstName.trim()
      const lastName = customerForm.lastName.trim()
      const email = customerForm.email.trim()
      const phone = customerForm.phone.trim()
      const contactName = `${firstName} ${lastName}`.trim()
      const nameValidationMessage =
        customerForm.customerType === 'corporate'
          ? 'Şirket yetkili adı ve soyadı zorunludur.'
          : 'Ad ve soyad alanları zorunludur.'
      const phoneValidationMessage =
        customerForm.customerType === 'corporate'
          ? 'Şirket yetkili telefon numarası zorunludur.'
          : 'Telefon numarası zorunludur.'

      if (isCorporate && !companyName) {
        setModalError('Kurumsal müşteri için şirket adı zorunludur.')
        return
      }

      if (isCorporate && !taxNumber) {
        setModalError('Kurumsal müşteri için vergi numarası zorunludur.')
        return
      }

      if (isCorporate && !taxOffice) {
        setModalError('Kurumsal müşteri için vergi dairesi zorunludur.')
        return
      }

      if (!isCorporate && (!/^\d{11}$/.test(tcIdentityNumber))) {
        setModalError('Bireysel müşteri için 11 haneli TC kimlik numarası girin.')
        return
      }

      if (!firstName || !lastName) {
        setModalError(nameValidationMessage)
        return
      }

      if (!phone) {
        setModalError(phoneValidationMessage)
        return
      }

      if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        setModalError('Geçerli bir email adresi girin veya boş bırakın.')
        return
      }

      if (modalState.mode === 'edit' && modalState.targetId) {
        setCustomers((current) =>
          current.map((item) =>
            item.id === modalState.targetId
              ? {
                  ...item,
                  customerType: customerForm.customerType,
                  tradeName: isCorporate ? companyName : contactName,
                  customerName: isCorporate ? companyName : contactName,
                  taxNumber: isCorporate ? taxNumber : tcIdentityNumber,
                  taxOffice: isCorporate ? taxOffice : '',
                  firstName,
                  lastName,
                  email,
                  contactName,
                  phone,
                }
              : item,
          ),
        )

        setModalError('')
        closeModal()
        return
      }

      if (modalState.mode === 'create' && pendingCustomerId) {
        setCustomers((current) =>
          current.map((item) =>
            item.id === pendingCustomerId
              ? {
                  ...item,
                  customerType: customerForm.customerType,
                  tradeName: isCorporate ? companyName : contactName,
                  customerName: isCorporate ? companyName : contactName,
                  taxNumber: isCorporate ? taxNumber : tcIdentityNumber,
                  taxOffice: isCorporate ? taxOffice : '',
                  firstName,
                  lastName,
                  email,
                  contactName,
                  phone,
                }
              : item,
          ),
        )

        setAddressForm((current) => ({
          ...current,
          contactName,
          phone,
        }))
        setCustomerCreateStep('address')
        setModalError('')
        return
      }

      const newCustomer: CustomerRecord = {
        id: `cust-${Date.now()}`,
        customerType: customerForm.customerType,
        tradeName: isCorporate ? companyName : contactName,
        customerName: isCorporate ? companyName : contactName,
        taxNumber: isCorporate ? taxNumber : tcIdentityNumber,
        taxOffice: isCorporate ? taxOffice : '',
        firstName,
        lastName,
        email,
        contactName,
        phone,
        city: '',
        district: '',
        neighborhood: '',
        branch: '',
      }

      setCustomers((current) => [...current, newCustomer])

      if (modalState.side === 'sender') {
        setSenderCustomerId(newCustomer.id)
        setSenderAddressId(null)
        setSenderDetailsOpen(false)
      } else {
        setReceiverCustomerId(newCustomer.id)
        setReceiverAddressId(null)
        setReceiverDetailsOpen(false)
      }

      setPendingCustomerId(newCustomer.id)
      setAddressForm({
        label: '',
        city: '',
        district: '',
        neighborhood: '',
        line1: '',
        contactName: newCustomer.contactName,
        phone: newCustomer.phone,
        branch: '',
      })
      setCustomerCreateStep('address')
      setModalError('')
      return
    }

    const selectedCustomerId =
      pendingCustomerId || (modalState.side === 'sender' ? senderCustomerId : receiverCustomerId)

    if (!selectedCustomerId) {
      setModalError('Önce bir müşteri seçmeniz gerekiyor.')
      return
    }

    if (!addressForm.label.trim() || !addressForm.line1.trim()) {
      setModalError('Adres başlığı ve açık adres zorunludur.')
      return
    }

    const addressCity = addressForm.city.trim()
    const addressDistrict = addressForm.district.trim()
    const addressNeighborhood = addressForm.neighborhood.trim()
    const addressPhone = addressForm.phone.trim() || '5XXXXXXXXX'
    const addressContactName = addressForm.contactName.trim() || 'Adres Yetkilisi'
    const resolvedBranch = resolveInterlandBranch(addressCity, addressDistrict, addressNeighborhood)

    if (!addressCity || !addressDistrict || !addressNeighborhood) {
      setModalError('Adres için şehir, ilçe ve mahalle bilgileri zorunludur.')
      return
    }

    if (modalState.mode === 'edit' && modalState.targetId) {
      setAddresses((current) =>
        current.map((item) =>
          item.id === modalState.targetId
            ? {
                ...item,
                customerId: selectedCustomerId,
                label: addressForm.label.trim(),
                line1: addressForm.line1.trim(),
                city: addressCity,
                district: addressDistrict,
                neighborhood: addressNeighborhood,
                phone: addressPhone,
                contactName: addressContactName,
                branch: resolvedBranch,
              }
            : item,
        ),
      )

      setCustomers((current) =>
        current.map((item) =>
          item.id === selectedCustomerId
            ? {
                ...item,
                city: addressCity,
                district: addressDistrict,
                neighborhood: addressNeighborhood,
                branch: resolvedBranch,
              }
            : item,
        ),
      )

      setModalError('')
      closeModal()
      return
    }

    const newAddress: AddressRecord = {
      id: `addr-${Date.now()}`,
      customerId: selectedCustomerId,
      label: addressForm.label.trim(),
      line1: addressForm.line1.trim(),
      city: addressCity,
      district: addressDistrict,
      neighborhood: addressNeighborhood,
      phone: addressPhone,
      contactName: addressContactName,
      branch: resolvedBranch,
    }

    setAddresses((current) => [...current, newAddress])
    setCustomers((current) =>
      current.map((item) =>
        item.id === selectedCustomerId
          ? {
              ...item,
              city: addressCity,
              district: addressDistrict,
              neighborhood: addressNeighborhood,
              branch: resolvedBranch,
            }
          : item,
      ),
    )

    if (modalState.side === 'sender') {
      setSenderAddressId(newAddress.id)
      setSenderDetailsOpen(true)
    } else {
      setReceiverAddressId(newAddress.id)
      setReceiverDetailsOpen(true)
    }

    setModalError('')
    closeModal()
  }

  const isCustomerCreateFlow = modalState?.entity === 'customer' && modalState?.mode === 'create'
  const isAddressStepInCreateFlow = isCustomerCreateFlow && customerCreateStep === 'address'
  const showCustomerStepIndicator = modalState?.entity === 'customer' && isCustomerCreateFlow
  const activeCustomerStepIndex = customerCreateSteps.findIndex((step) => step.id === customerCreateStep)
  const selectedCustomerTypeLabel = customerForm.customerType === 'corporate' ? 'Kurumsal Müşteri' : 'Bireysel Müşteri'
  const selectedCustomerSummary =
    customerForm.customerType === 'corporate'
      ? { label: 'Şirket Adı', value: customerForm.tradeName.trim() }
      : { label: 'Müşteri Ad Ve Soyadı', value: `${customerForm.firstName} ${customerForm.lastName}`.trim() }
  const contactNameLabel = customerForm.customerType === 'corporate' ? 'Şirket Yetkili Adı' : 'Ad'
  const contactSurnameLabel = customerForm.customerType === 'corporate' ? 'Şirket Yetkili Soyadı' : 'Soyad'
  const contactEmailLabel = customerForm.customerType === 'corporate' ? 'Şirket Yetkili Email' : 'Email'
  const contactPhoneLabel = customerForm.customerType === 'corporate' ? 'Şirket Yetkili Telefonu' : 'Telefon Numarası'

  const goBackInModal = () => {
    if (!isCustomerCreateFlow) {
      closeModal()
      return
    }

    if (customerCreateStep === 'address') {
      setCustomerCreateStep('customer')
      setModalError('')
      return
    }

    if (customerCreateStep === 'customer') {
      setCustomerCreateStep('type')
      setModalError('')
      return
    }

    closeModal()
  }

  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Kargolar', href: '/kargolar' },
          { label: 'Yeni Kargo' },
        ]}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 bg-slate-50 p-4 pb-24 pt-3 lg:px-4 lg:pb-24 lg:pt-3">

        <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_340px]">
          <PartyPanel
            title="Gönderici"
            customerLabel="Gönderici Müşteri"
            addressLabel="Gönderici Adres"
            detailsLabel="Gönderici Adres Bilgileri"
            emptyHint=""
            customerOptions={customerOptions}
            addressOptions={senderAddressOptions}
            selectedCustomerId={senderCustomerId}
            selectedAddressId={senderAddressId}
            selectedCustomer={senderCustomer}
            selectedAddress={senderAddress}
            detailsOpen={senderDetailsOpen}
            onCustomerSelect={(value) => {
              setSenderCustomerId(value)
              setSenderAddressId(null)
              setSenderDetailsOpen(false)
            }}
            onAddressSelect={(value) => {
              setSenderAddressId(value)
              setSenderDetailsOpen(true)
            }}
            onToggleDetails={() => setSenderDetailsOpen((current) => !current)}
            onCreateCustomer={() => openCreateModal('sender', 'customer')}
            onCreateAddress={() => openCreateModal('sender', 'address')}
            onEditCustomer={() => openEditModal('sender', 'customer')}
            onEditAddress={() => openEditModal('sender', 'address')}
          />

          <PartyPanel
            title="Alıcı"
            customerLabel="Alıcı Müşteri"
            addressLabel="Alıcı Adres"
            detailsLabel="Alıcı Adres Bilgileri"
            emptyHint=""
            customerOptions={customerOptions}
            addressOptions={receiverAddressOptions}
            selectedCustomerId={receiverCustomerId}
            selectedAddressId={receiverAddressId}
            selectedCustomer={receiverCustomer}
            selectedAddress={receiverAddress}
            detailsOpen={receiverDetailsOpen}
            onCustomerSelect={(value) => {
              setReceiverCustomerId(value)
              setReceiverAddressId(null)
              setReceiverDetailsOpen(false)
            }}
            onAddressSelect={(value) => {
              setReceiverAddressId(value)
              setReceiverDetailsOpen(true)
            }}
            onToggleDetails={() => setReceiverDetailsOpen((current) => !current)}
            onCreateCustomer={() => openCreateModal('receiver', 'customer')}
            onCreateAddress={() => openCreateModal('receiver', 'address')}
            onEditCustomer={() => openEditModal('receiver', 'customer')}
            onEditAddress={() => openEditModal('receiver', 'address')}
          />

          <Card className="h-full rounded-[30px] border-slate-200 bg-white shadow-sm">
            <CardContent className="h-full space-y-3 p-4">
              <RightSectionCard title="Ödeme & Fatura">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">Ödeme Türü</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white px-4 text-left shadow-sm">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PÖ">Gönderici</SelectItem>
                        <SelectItem value="AÖ">Alıcı</SelectItem>
                        <SelectItem value="CÖ">Cari</SelectItem>
                        <SelectItem value="DÖ">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">Fatura Türü</Label>
                    <Select value={invoiceTarget} onValueChange={setInvoiceTarget}>
                      <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white px-4 text-left shadow-sm">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sender">Gönderici</SelectItem>
                        <SelectItem value="receiver">Alıcı</SelectItem>
                        <SelectItem value="current">Cari</SelectItem>
                        <SelectItem value="other">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </RightSectionCard>

              <RightSectionCard title="Sipariş Detayı">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">Sipariş Türü</Label>
                    <Select value={shipmentType} onValueChange={setShipmentType}>
                      <SelectTrigger className="h-11 w-full rounded-2xl border-slate-200 bg-white px-4 text-left shadow-sm">
                        <SelectValue placeholder="Seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standart">Standart</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                        <SelectItem value="parsiyel">Parsiyel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-500">SMS Seçimi</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <SmsToggleButton label="Alıcı" active={notifyReceiver} onClick={() => setNotifyReceiver((current) => !current)} />
                      <SmsToggleButton label="Gönderici" active={notifySender} onClick={() => setNotifySender((current) => !current)} />
                    </div>
                  </div>
                </div>
              </RightSectionCard>

              <RightSectionCard title="Evrak (Opsiyonel)">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500">İrsaliye No</Label>
                    <Input
                      value={waybillNo}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setWaybillNo(event.target.value)}
                      placeholder="IRS-2026001"
                      className="h-11 rounded-2xl border-slate-200 bg-white px-3.5 text-sm shadow-sm focus-visible:ring-slate-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-slate-500">ATF No</Label>
                    <Input
                      value={atfNo}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setAtfNo(event.target.value)}
                      placeholder="ATF-000123"
                      className="h-11 rounded-2xl border-slate-200 bg-white px-3.5 text-sm shadow-sm focus-visible:ring-slate-300"
                    />
                  </div>
                </div>
              </RightSectionCard>
            </CardContent>
          </Card>
        </div>

        <div ref={pieceSectionRef} className="scroll-mt-24">
          <Card className="rounded-[30px] border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className={STANDARD_SECTION_TITLE_CLASS}>Parça Listesi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="grid gap-3 xl:grid-cols-8">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">Parça Tipi</Label>
                    <Select
                      value={pieceForm.pieceType}
                      onValueChange={(value: string) => setPieceForm((current) => ({ ...current, pieceType: value }))}
                    >
                      <SelectTrigger className={STANDARD_SELECT_TRIGGER_CLASS}>
                        <SelectValue placeholder="Parça Tipi" />
                      </SelectTrigger>
                      <SelectContent>
                        {pieceTypeOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">En</Label>
                    <Input
                      value={pieceForm.en}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setPieceForm((current) => ({ ...current, en: event.target.value }))}
                      className={STANDARD_INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">Boy</Label>
                    <Input
                      value={pieceForm.boy}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setPieceForm((current) => ({ ...current, boy: event.target.value }))}
                      className={STANDARD_INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">Yükseklik</Label>
                    <Input
                      value={pieceForm.yukseklik}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setPieceForm((current) => ({ ...current, yukseklik: event.target.value }))}
                      className={STANDARD_INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">Adet</Label>
                    <Input
                      value={pieceForm.adet}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setPieceForm((current) => ({ ...current, adet: event.target.value }))}
                      className={STANDARD_INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">Desi</Label>
                    <Input
                      value={pieceForm.desi}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setPieceForm((current) => ({ ...current, desi: event.target.value }))}
                      className={STANDARD_INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-600">Kg</Label>
                    <Input
                      value={pieceForm.kg}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setPieceForm((current) => ({ ...current, kg: event.target.value }))}
                      className={STANDARD_INPUT_CLASS}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-transparent">Aksiyon</Label>
                    <Button onClick={handleAddPiece} className={`${STANDARD_PRIMARY_BUTTON_CLASS} w-full`}>
                      Ekle
                    </Button>
                  </div>
                </div>
              </div>

              <DataTable
                data={pieceRows}
                columns={pieceColumns}
                enablePagination={false}
                enableGlobalFilter={false}
                enableColumnVisibility={false}
                enableHorizontalScroll
                emptyMessage="Henüz parça eklenmedi."
                className="[&_thead_tr]:bg-slate-50 [&_thead_th]:font-semibold [&_thead_th]:text-slate-600"
              />
            </CardContent>
          </Card>
        </div>

        <div ref={pricingSectionRef} className="scroll-mt-24">
          <Card className="rounded-[30px] border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className={STANDARD_SECTION_TITLE_CLASS}>Fiyatlandırma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 lg:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <Label className="mb-2 block text-sm font-medium text-slate-500">Taşıma Ücreti</Label>
                  <div className="relative">
                    <Input
                      value={shippingPrice}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setShippingPrice(event.target.value)}
                      className={`${STANDARD_INPUT_CLASS} pr-10`}
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base font-medium text-slate-500">₺</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">KDV Hariç</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-medium text-slate-500">KDV (%{kdvRate})</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{formatCurrencyTrailing(kdvAmount)}</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-sm font-medium text-slate-500">Genel Toplam</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{formatCurrencyTrailing(grandTotal)}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <Label className="mb-3 block text-lg font-semibold text-slate-900">Not</Label>
                <Textarea
                  value={cargoNote}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setCargoNote(event.target.value)}
                  placeholder="İlgili notunuz..."
                  className="min-h-32 rounded-2xl border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus-visible:ring-slate-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className={cn(
          'fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur-sm',
          sidebarState === 'collapsed' ? 'md:left-(--sidebar-width-icon)' : 'md:left-(--sidebar-width)',
        )}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="default" className={STANDARD_PRIMARY_BUTTON_CLASS} asChild>
              <a href="/arf/cargo/shipments">Taslaklar</a>
            </Button>
            <div className="flex items-center gap-3">
              <Button variant="outline" className={STANDARD_PRIMARY_BUTTON_CLASS}>
                Taslak Olarak Kaydet
              </Button>
              <Button className={STANDARD_PRIMARY_BUTTON_CLASS} onClick={handlePrimaryAction} disabled={primaryButtonDisabled}>
                {primaryButtonLabel}
              </Button>
            </div>
          </div>
        </div>

      </div>

      {modalState && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/45 p-4 pt-16 backdrop-blur-[2px]">
          <div className="max-h-[calc(100vh-5rem)] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold text-slate-900">
                  {isAddressStepInCreateFlow
                    ? `${modalState.side === 'sender' ? 'Gönderici' : 'Alıcı'} Adresi Ekle`
                    : `${modalState.mode === 'edit' ? 'Düzenle' : 'Yeni'} ${modalState.side === 'sender' ? 'Gönderici' : 'Alıcı'} ${modalState.entity === 'customer' ? 'Müşteri' : 'Adres'} ${modalState.mode === 'edit' ? '' : 'Ekle'}`}
                </h2>
                <p className="text-sm text-slate-500">
                  {isAddressStepInCreateFlow
                    ? 'Müşteri kaydı tamamlandı. Şimdi adres bilgisini ekleyip seçimi tamamlayabilirsiniz.'
                    : modalState.mode === 'edit'
                    ? 'Kayıt bilgilerini güncelleyip kaydedin.'
                    : modalState.entity === 'customer'
                    ? 'Önce müşteri tipini seçin, ardından formu doldurup adrese geçin.'
                    : 'Adres bilgisini oluşturun, seçili müşterinin altında anında kullanılabilir olsun.'}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-2xl" onClick={closeModal}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="space-y-5 px-6 py-6">
              {showCustomerStepIndicator && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    {customerCreateSteps.map((step, index) => {
                      const isActive = index === activeCustomerStepIndex
                      const isCompleted = index < activeCustomerStepIndex

                      return (
                        <div
                          key={step.id}
                          className={cn(
                            'inline-flex min-w-0 flex-1 items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition',
                            isActive
                              ? 'bg-slate-900 text-white shadow-sm'
                              : isCompleted
                              ? 'bg-lime-50 text-slate-900'
                              : 'bg-white text-slate-500',
                          )}
                        >
                          <div
                            className={cn(
                              'flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                              isActive ? 'bg-white/15 text-white' : isCompleted ? 'bg-lime-200 text-slate-900' : 'bg-slate-100 text-slate-500',
                            )}
                          >
                            {index + 1}
                          </div>
                          <div className="min-w-0 truncate font-medium">{step.label}</div>
                        </div>
                      )
                    })}
                  </div>

                  {customerCreateStep !== 'type' && (
                    <div className="px-1 text-xs font-medium tracking-wide text-slate-500 uppercase">
                      {customerCreateStep === 'address' ? (
                        <>
                          {selectedCustomerSummary.label}:{' '}
                          <span className="font-semibold text-slate-800">{selectedCustomerSummary.value || '-'}</span>
                        </>
                      ) : (
                        <>
                          Seçilen tip: <span className="font-semibold text-slate-800">{selectedCustomerTypeLabel}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {modalState.entity === 'customer' && customerCreateStep === 'type' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className={cn(
                        'group rounded-[24px] border px-5 py-4 text-left transition',
                        customerForm.customerType === 'corporate'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white',
                      )}
                      onClick={() => setCustomerForm((current) => ({ ...current, customerType: 'corporate' }))}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold">Kurumsal Müşteri</div>
                          <div
                            className={cn(
                              'mt-1 text-sm',
                              customerForm.customerType === 'corporate' ? 'text-white/75' : 'text-slate-500',
                            )}
                          >
                            Vergi bilgileri ve şirket yetkilisi ile kayıt oluşturun.
                          </div>
                        </div>
                        <div
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition',
                            customerForm.customerType === 'corporate'
                              ? 'border-white bg-white text-slate-900'
                              : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400',
                          )}
                        >
                          <div className="size-2 rounded-full bg-current" />
                        </div>
                      </div>
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'group rounded-[24px] border px-5 py-4 text-left transition',
                        customerForm.customerType === 'individual'
                          ? 'border-slate-900 bg-slate-900 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white',
                      )}
                      onClick={() => setCustomerForm((current) => ({ ...current, customerType: 'individual' }))}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-lg font-semibold">Bireysel Müşteri</div>
                          <div
                            className={cn(
                              'mt-1 text-sm',
                              customerForm.customerType === 'individual' ? 'text-white/75' : 'text-slate-500',
                            )}
                          >
                            Kişisel kimlik ve iletişim bilgileriyle hızlı kayıt açın.
                          </div>
                        </div>
                        <div
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition',
                            customerForm.customerType === 'individual'
                              ? 'border-white bg-white text-slate-900'
                              : 'border-slate-300 bg-white text-transparent group-hover:border-slate-400',
                          )}
                        >
                          <div className="size-2 rounded-full bg-current" />
                        </div>
                      </div>
                    </button>
                  </div>
                  <p className="text-center text-sm text-slate-500">
                    Devam etmeden önce müşteri tipini seçin. Sonraki adımda form alanları seçime göre açılacaktır.
                  </p>
                </div>
              ) : modalState.entity === 'customer' && customerCreateStep === 'customer' ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {customerForm.customerType === 'corporate' ? (
                      <>
                        <div className="sm:col-span-2">
                          <FloatingLabelField
                            label="Şirket Adı"
                            value={customerForm.tradeName}
                            placeholder="Şirket adı"
                            onChange={(value) => setCustomerForm((current) => ({ ...current, tradeName: value }))}
                          />
                        </div>
                        <FloatingLabelField
                          label="Vergi Numarası"
                          value={customerForm.taxNumber}
                          placeholder="Vergi numarası"
                          onChange={(value) => setCustomerForm((current) => ({ ...current, taxNumber: value }))}
                        />
                        <FloatingLabelField
                          label="Vergi Dairesi"
                          value={customerForm.taxOffice}
                          placeholder="Vergi dairesi"
                          onChange={(value) => setCustomerForm((current) => ({ ...current, taxOffice: value }))}
                        />
                        <div className="sm:col-span-2 pt-1">
                          <h3 className="text-sm font-semibold text-slate-900">Şirket Yetkili Bilgileri</h3>
                        </div>
                      </>
                    ) : null}

                    <FloatingLabelField
                      label={contactNameLabel}
                      value={customerForm.firstName}
                      placeholder={contactNameLabel}
                      onChange={(value) => setCustomerForm((current) => ({ ...current, firstName: value }))}
                    />
                    <FloatingLabelField
                      label={contactSurnameLabel}
                      value={customerForm.lastName}
                      placeholder={contactSurnameLabel}
                      onChange={(value) => setCustomerForm((current) => ({ ...current, lastName: value }))}
                    />

                    {customerForm.customerType === 'individual' && (
                      <div className="sm:col-span-2">
                        <FloatingLabelField
                          label="TC Kimlik Numarası"
                          value={customerForm.tcIdentityNumber}
                          placeholder="11 haneli TC kimlik numarası"
                          onChange={(value) => setCustomerForm((current) => ({ ...current, tcIdentityNumber: value }))}
                        />
                      </div>
                    )}

                    <FloatingLabelField
                      label={contactEmailLabel}
                      value={customerForm.email}
                      placeholder={customerForm.customerType === 'corporate' ? 'Yetkili email' : 'Email (bireyselde opsiyonel)'}
                      onChange={(value) => setCustomerForm((current) => ({ ...current, email: value }))}
                    />
                    <FloatingLabelField
                      label={contactPhoneLabel}
                      value={customerForm.phone}
                      placeholder="5XX XXX XX XX"
                      onChange={(value) => setCustomerForm((current) => ({ ...current, phone: value }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                    <div>
                      <FloatingLabelField
                        label="Adres Başlığı"
                        value={addressForm.label}
                        placeholder="Örn: Merkez Depo"
                        onChange={(value) => setAddressForm((current) => ({ ...current, label: value }))}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-500">Şehir</Label>
                        <Select value={addressForm.city} onValueChange={(value: string) => setAddressForm((current) => ({ ...current, city: value }))}>
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 shadow-sm">
                            <SelectValue placeholder="Şehir Seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {cityOptions.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-500">İlçe</Label>
                        <Select value={addressForm.district} onValueChange={(value: string) => setAddressForm((current) => ({ ...current, district: value }))}>
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 shadow-sm">
                            <SelectValue placeholder="İlçe Seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {districtOptions.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-500">Mahalle</Label>
                        <Select
                          value={addressForm.neighborhood}
                          onValueChange={(value: string) => setAddressForm((current) => ({ ...current, neighborhood: value }))}
                        >
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-white px-4 shadow-sm">
                            <SelectValue placeholder="Mahalle Seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            {neighborhoodOptions.map((neighborhood) => (
                              <SelectItem key={neighborhood} value={neighborhood}>
                                {neighborhood}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label className="mb-2 block text-sm font-medium text-slate-500">Açık Adres</Label>
                      <Textarea
                        value={addressForm.line1}
                        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setAddressForm((current) => ({ ...current, line1: event.target.value }))}
                        placeholder="Cadde, sokak, bina ve kapı numarasını girin"
                        className="min-h-32 rounded-2xl border-slate-200 bg-white px-4 py-3 shadow-sm focus-visible:ring-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {modalError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
                  {modalError}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <Button variant="outline" className="rounded-2xl" onClick={goBackInModal}>
                Geri
              </Button>
              <Button className="rounded-2xl" onClick={saveModal}>
                {modalState.entity === 'customer' && customerCreateStep === 'type'
                  ? 'Devam Et'
                  : isAddressStepInCreateFlow
                  ? 'Adresi Kaydet ve Seç'
                  : modalState.entity === 'customer' && modalState.mode === 'create'
                  ? 'Müşteriyi Kaydet ve Adrese Geç'
                  : 'Kaydet ve Seç'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function PartyPanel({
  title,
  customerLabel,
  addressLabel,
  detailsLabel,
  emptyHint,
  customerOptions,
  addressOptions,
  selectedCustomerId,
  selectedAddressId,
  selectedCustomer,
  selectedAddress,
  detailsOpen,
  onCustomerSelect,
  onAddressSelect,
  onToggleDetails,
  onCreateCustomer,
  onCreateAddress,
  onEditCustomer,
  onEditAddress,
}: PartyPanelProps) {
  const canChooseAddress = Boolean(selectedCustomerId)
  const canShowDetails = Boolean(selectedCustomer && selectedAddress)

  return (
    <Card className="h-full rounded-[24px] border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2.5">
        <CardTitle className={STANDARD_SECTION_TITLE_CLASS}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        <SearchableCombobox
          label={customerLabel}
          placeholder={customerLabel}
          searchPlaceholder={`${customerLabel} ara...`}
          emptyText="Sonuç bulunamadı"
          options={customerOptions}
          selectedId={selectedCustomerId}
          onSelect={onCustomerSelect}
          onCreate={onCreateCustomer}
          onEdit={onEditCustomer}
          helperText={emptyHint}
        />

        <div
          className={cn(
            'overflow-hidden transition-all duration-300 ease-out',
            canChooseAddress ? 'max-h-36 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <SearchableCombobox
            label={addressLabel}
            placeholder={canChooseAddress ? addressLabel : 'Önce müşteri seçin'}
            searchPlaceholder={`${addressLabel} ara...`}
            emptyText="Bu müşteriye bağlı adres bulunamadı"
            options={addressOptions}
            selectedId={selectedAddressId}
            onSelect={onAddressSelect}
            onCreate={onCreateAddress}
            onEdit={onEditAddress}
            disabled={!canChooseAddress}
            createDisabled={!canChooseAddress}
          />
        </div>

        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-out',
            canShowDetails ? 'max-h-[1200px] overflow-visible opacity-100' : 'max-h-0 overflow-hidden opacity-0',
          )}
        >
          <button
            type="button"
            onClick={onToggleDetails}
            className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2 text-center text-sm font-medium text-slate-600 transition hover:bg-white/60"
          >
            <span>{detailsLabel}</span>
            <ChevronDown className={cn('size-4 transition-transform duration-200', detailsOpen && 'rotate-180')} />
          </button>

          <div
            className={cn(
              'grid gap-4 transition-all duration-300 ease-out',
              detailsOpen ? 'mt-2.5 max-h-[1000px] overflow-visible opacity-100' : 'max-h-0 overflow-hidden opacity-0',
            )}
          >
            <div className="grid gap-3 pt-2 md:grid-cols-2">
              <FloatingLabelDisplay label="VKN / TCKN" value={selectedCustomer?.taxNumber} />
              <FloatingLabelDisplay label="Telefon Numarası" value={selectedAddress?.phone} />
              <FloatingLabelDisplay label="Şube" value={selectedAddress?.branch || selectedCustomer?.branch} />
              <FloatingLabelDisplay label="İl" value={selectedAddress?.city} />
              <FloatingLabelDisplay label="İlçe" value={selectedAddress?.district} />
              <FloatingLabelDisplay label="Mahalle" value={selectedAddress?.neighborhood} />
              <div className="md:col-span-2">
                <FloatingLabelDisplay label="Açık Adres" value={selectedAddress?.line1} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SearchableCombobox({
  label,
  placeholder,
  searchPlaceholder,
  emptyText,
  options,
  selectedId,
  onSelect,
  onCreate,
  onEdit,
  helperText,
  disabled,
  createDisabled,
}: {
  label: string
  placeholder: string
  searchPlaceholder: string
  emptyText: string
  options: ComboboxOption[]
  selectedId: string | null
  onSelect: (value: string) => void
  onCreate: () => void
  onEdit?: () => void
  helperText?: string
  disabled?: boolean
  createDisabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find((item) => item.id === selectedId)
  const isEditMode = Boolean(selectedId && onEdit)

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-slate-500">{label}</Label>
      <div className={cn('flex h-11 items-center rounded-2xl border border-slate-200 bg-white shadow-sm', disabled && 'bg-slate-50')}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 text-left outline-none"
            >
              <span className={cn('truncate text-sm', selectedOption ? 'text-slate-900' : 'text-slate-400')}>
                {selectedOption?.label || placeholder}
              </span>
              <ChevronDown className="size-4 shrink-0 text-slate-400" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-(--radix-popover-trigger-width) rounded-2xl border-slate-200 p-0 shadow-xl">
            <Command>
              <CommandInput placeholder={searchPlaceholder} />
              <CommandList>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={`${item.label} ${item.description || ''} ${item.keywords || ''}`}
                      onSelect={() => {
                        onSelect(item.id)
                        setOpen(false)
                      }}
                      className="flex flex-col items-start gap-0.5 px-3 py-3"
                    >
                      <span className="font-medium text-slate-900">{item.label}</span>
                      {item.description && <span className="text-xs text-slate-500">{item.description}</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="h-6 w-px bg-slate-200" />

        <button
          type="button"
          onClick={isEditMode ? onEdit : onCreate}
          disabled={disabled || (!isEditMode && createDisabled)}
          className="inline-flex h-full items-center gap-1.5 rounded-r-2xl px-3.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          {isEditMode ? <Pencil className="size-4" /> : <Plus className="size-4" />}
          {isEditMode ? 'Düzelt' : 'Yeni'}
        </button>
      </div>
      {helperText && <p className="text-[10px] text-slate-500">{helperText}</p>}
    </div>
  )
}

function FloatingLabelDisplay({ label, value }: { label: string; value?: string }) {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm">
        <div className="absolute left-3 top-0 inline-flex -translate-y-1/2 items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] leading-none font-semibold whitespace-nowrap tracking-tight text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          {label}
        </div>
        <p className={cn('min-h-6 text-[15px] font-medium text-slate-900', !value && 'text-slate-400')}>
          {value || 'Henüz seçilmedi'}
        </p>
      </div>
    </div>
  )
}

function FloatingLabelField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-500">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-2xl border-slate-200 bg-slate-50 px-4 shadow-sm focus-visible:ring-slate-300"
      />
    </div>
  )
}

function RightSectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-3.5 flex items-center gap-3">
        <h3 className="text-[17px] font-semibold tracking-tight text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SmsToggleButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-11 rounded-2xl border text-sm font-medium transition',
        active
          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
      )}
    >
      {label}
    </button>
  )
}
