"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { InterlandNote } from "../../_types"

type NoteInput = Omit<InterlandNote, "id" | "createdAt">

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (payload: NoteInput) => Promise<void>
}

export function NoteModal({ open, onOpenChange, onAdd }: Props) {
  const [category, setCategory] = useState<InterlandNote["category"]>("genel")
  const [visibility, setVisibility] = useState<InterlandNote["visibility"]>("public")
  const [content, setContent] = useState("")

  useEffect(() => {
    if (!open) {
      setCategory("genel")
      setVisibility("public")
      setContent("")
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Not Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Kategori</Label>
            <Select value={category} onValueChange={(value: InterlandNote["category"]) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="genel">Genel</SelectItem>
                <SelectItem value="operasyon">Operasyon</SelectItem>
                <SelectItem value="teknik">Teknik</SelectItem>
                <SelectItem value="diger">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Görünürlük</Label>
            <RadioGroup value={visibility} onValueChange={(value: InterlandNote["visibility"]) => setVisibility(value)}>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="visibility-internal" value="internal" />
                <Label htmlFor="visibility-internal" className="cursor-pointer font-normal">
                  Sadece Genel Merkez Görür
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="visibility-public" value="public" />
                <Label htmlFor="visibility-public" className="cursor-pointer font-normal">
                  Herkes Görür
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note-content">İçerik</Label>
            <Textarea id="note-content" value={content} onChange={(event) => setContent(event.target.value)} className="min-h-28" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Vazgeç
          </Button>
          <Button
            type="button"
            disabled={content.trim().length < 10}
            onClick={async () => {
              if (content.trim().length < 10) {
                return
              }
              await onAdd({
                content: content.trim(),
                category,
                visibility,
                createdBy: "current-user",
                createdByName: "Mevcut Kullanıcı",
              })
              onOpenChange(false)
            }}
          >
            Notu Kaydet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
