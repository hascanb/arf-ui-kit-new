"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"
import { turkeyCityDistrictNeighborhoods } from "../../_mock/turkey-geography-mock-data"
import type { InterlandScopeRow } from "../../_types"

interface ScopeModalInitialValue {
  city: string
  district: string
  neighborhoods: string[]
  sourceIds?: string[]
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  scopeRows: InterlandScopeRow[]
  initial?: ScopeModalInitialValue
  onSave: (payload: {
    city: string
    district: string
    neighborhoods: string[]
    sourceIds?: string[]
  }) => Promise<void>
}

function normalizeForSearch(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
}

export function ScopeUpdateModal({ open, onOpenChange, scopeRows, initial, onSave }: Props) {
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [districtOpen, setDistrictOpen] = useState(false)
  const [neighborhoodOpen, setNeighborhoodOpen] = useState(false)

  useEffect(() => {
    setCity(initial?.city ?? "")
    setDistrict(initial?.district ?? "")
    setSelectedNeighborhoods(initial?.neighborhoods ?? [])
  }, [initial, open])

  const citiesFromExisting = Array.from(new Set(scopeRows.map((item) => item.city)))
  const cityOptions = Array.from(
    new Set([...Object.keys(turkeyCityDistrictNeighborhoods), ...citiesFromExisting]),
  ).sort((a, b) => a.localeCompare(b, "tr"))

  const districtsFromCityDictionary = Object.keys(turkeyCityDistrictNeighborhoods[city] ?? {})
  const districtsFromExisting = Array.from(
    new Set(scopeRows.filter((item) => item.city === city).map((item) => item.district)),
  )
  const districtOptions = Array.from(
    new Set([...districtsFromCityDictionary, ...districtsFromExisting]),
  ).sort((a, b) => a.localeCompare(b, "tr"))

  const neighborhoodsFromDictionary =
    turkeyCityDistrictNeighborhoods[city]?.[district] ?? []
  const neighborhoodsFromExisting = Array.from(
    new Set(
      scopeRows
        .filter((item) => item.city === city && item.district === district)
        .map((item) => item.neighborhood),
    ),
  )
  const neighborhoodOptions = Array.from(
    new Set([...neighborhoodsFromDictionary, ...neighborhoodsFromExisting]),
  ).sort((a, b) => a.localeCompare(b, "tr"))

  const toggleNeighborhood = (name: string) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    )
  }

  const allNeighborhoodsSelected =
    neighborhoodOptions.length > 0 && selectedNeighborhoods.length === neighborhoodOptions.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initial ? "Kapsam Satırı Düzenle" : "Kapsamı Güncelle"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-1 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Şehir</Label>
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between font-normal">
                  {city || "Şehir seçin"}
                  <ChevronDown className="ml-2 size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command filter={(value: string, search: string) => (normalizeForSearch(value).includes(normalizeForSearch(search)) ? 1 : 0)}>
                  <CommandInput placeholder="Şehir ara..." />
                  <CommandList>
                    <CommandEmpty>Şehir bulunamadı.</CommandEmpty>
                    <CommandGroup>
                      {cityOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => {
                            setCity(option)
                            setDistrict("")
                            setSelectedNeighborhoods([])
                            setCityOpen(false)
                          }}
                        >
                          <Check className={cn("mr-2 size-4", city === option ? "opacity-100" : "opacity-0")} />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1.5">
            <Label>İlçe</Label>
            <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={!city}
                  className="w-full justify-between font-normal"
                >
                  {district || "İlçe seçin"}
                  <ChevronDown className="ml-2 size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command filter={(value: string, search: string) => (normalizeForSearch(value).includes(normalizeForSearch(search)) ? 1 : 0)}>
                  <CommandInput placeholder="İlçe ara..." />
                  <CommandList>
                    <CommandEmpty>İlçe bulunamadı.</CommandEmpty>
                    <CommandGroup>
                      {districtOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => {
                            setDistrict(option)
                            setSelectedNeighborhoods([])
                            setDistrictOpen(false)
                          }}
                        >
                          <Check className={cn("mr-2 size-4", district === option ? "opacity-100" : "opacity-0")} />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Mahalle</Label>
            <Popover open={neighborhoodOpen} onOpenChange={setNeighborhoodOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!city || !district}
                  className="w-full justify-between font-normal"
                >
                  {selectedNeighborhoods.length === 0
                    ? "Mahalle seçin"
                    : selectedNeighborhoods.length === 1
                      ? selectedNeighborhoods[0]
                      : `${selectedNeighborhoods.length} mahalle seçildi`}
                  <ChevronDown className="ml-2 size-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command filter={(value: string, search: string) => (normalizeForSearch(value).includes(normalizeForSearch(search)) ? 1 : 0)}>
                  <CommandInput placeholder="Mahalle ara..." />
                  <CommandList className="max-h-72">
                    <CommandEmpty>Mahalle bulunamadı.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Tümünü Seç"
                        onSelect={() => {
                          if (allNeighborhoodsSelected) {
                            setSelectedNeighborhoods([])
                            return
                          }
                          setSelectedNeighborhoods(neighborhoodOptions)
                        }}
                      >
                        <Checkbox checked={allNeighborhoodsSelected} className="mr-2" />
                        Tümünü Seç
                      </CommandItem>
                      {neighborhoodOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={() => toggleNeighborhood(option)}
                        >
                          <Checkbox checked={selectedNeighborhoods.includes(option)} className="mr-2" />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button
            type="button"
            disabled={!city.trim() || !district.trim() || selectedNeighborhoods.length === 0 || isSubmitting}
            onClick={async () => {
              if (!city.trim() || !district.trim() || selectedNeighborhoods.length === 0) {
                return
              }
              setIsSubmitting(true)
              try {
                await onSave({
                  city: city.trim(),
                  district: district.trim(),
                  neighborhoods: selectedNeighborhoods,
                  sourceIds: initial?.sourceIds,
                })
                onOpenChange(false)
              } finally {
                setIsSubmitting(false)
              }
            }}
          >
            Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
