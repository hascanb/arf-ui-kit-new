"use client"

import type { ChangeEvent } from "react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { InterlandRecord } from "../_types"

interface BranchOption {
  id: string
  name: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  branches: BranchOption[]
  onCreate: (payload: { name: string; branchId: string; branchName: string }) => Promise<InterlandRecord>
}

export function CreateInterlandModal({ open, onOpenChange, branches, onCreate }: Props) {
  const [name, setName] = useState("")
  const [branchId, setBranchId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedBranch = useMemo(
    () => branches.find((branch) => branch.id === branchId),
    [branchId, branches],
  )

  const reset = () => {
    setName("")
    setBranchId("")
  }

  const handleSubmit = async () => {
    if (!name.trim() || !selectedBranch || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      await onCreate({ name: name.trim(), branchId: selectedBranch.id, branchName: selectedBranch.name })
      reset()
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>İnterland Oluştur</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-1">
          <div className="space-y-1.5">
            <Label htmlFor="interland-name">İnterland Adı</Label>
            <Input id="interland-name" value={name} onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)} placeholder="Örn: Bursa Ana İnterland" />
          </div>
          <div className="space-y-1.5">
            <Label>Bağlı Şube</Label>
            <Select value={branchId} onValueChange={setBranchId}>
              <SelectTrigger>
                <SelectValue placeholder="Şube seçin" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!name.trim() || !branchId || isSubmitting}>
            {isSubmitting ? "Oluşturuluyor..." : "Oluştur"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
