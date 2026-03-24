"use client"

import { useMemo, useState } from "react"
import type { Table as TanStackTable } from "@tanstack/react-table"
import {
  DataTable,
  DataTablePagination,
} from "@hascanb/arf-ui-kit/datatable-kit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { addInterlandAuditLog } from "../_api/interland-audit-api"
import { addInterlandNote, deleteInterlandNote } from "../_api/interland-notes-api"
import { auditColumns } from "../_columns/audit-columns"
import type { InterlandAuditLog, InterlandDetail, InterlandNote } from "../../_types"
import { NoteModal } from "./note-modal"

const categoryLabelMap: Record<InterlandNote["category"], string> = {
  genel: "Genel",
  operasyon: "Operasyon",
  teknik: "Teknik",
  diger: "Diğer",
}

interface Props {
  interland: InterlandDetail
  onInterlandChange: (next: InterlandDetail) => void
}

export function DetailNotesHistorySection({ interland, onInterlandChange }: Props) {
  const [table, setTable] = useState<TanStackTable<InterlandAuditLog> | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const sortedNotes = useMemo(
    () => [...interland.notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [interland.notes],
  )

  const sortedAudits = useMemo(
    () => [...interland.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [interland.auditLogs],
  )

  return (
    <div className="space-y-4">
      <NoteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onAdd={async (payload) => {
          const nextNotes = await addInterlandNote(interland.notes, payload)
          const nextAudits = await addInterlandAuditLog(interland.auditLogs, {
            actionType: "edit",
            oldValue: "-",
            newValue: "Yeni not eklendi",
            actorId: "current-user",
            actorName: "Mevcut Kullanici",
          })

          onInterlandChange({ ...interland, notes: nextNotes, auditLogs: nextAudits })
        }}
      />

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-700">Notlar</CardTitle>
          <Button size="sm" onClick={() => setModalOpen(true)}>Yeni Not Ekle</Button>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-3 pt-4">
          {sortedNotes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              Henüz not bulunmuyor.
            </div>
          ) : (
            sortedNotes.map((note) => (
              <article key={note.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{categoryLabelMap[note.category]}</Badge>
                    <Badge variant="outline">{note.visibility === "internal" ? "Sadece Genel Merkez" : "Herkes"}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{new Date(note.createdAt).toLocaleString("tr-TR")}</span>
                    <button
                      type="button"
                      className="text-red-600"
                      onClick={async () => {
                        if (!window.confirm("Not silinsin mi?")) {
                          return
                        }
                        const nextNotes = await deleteInterlandNote(interland.notes, note.id)
                        const nextAudits = await addInterlandAuditLog(interland.auditLogs, {
                          actionType: "edit",
                          oldValue: "Not kaydı",
                          newValue: "Not silindi",
                          actorId: "current-user",
                          actorName: "Mevcut Kullanıcı",
                        })
                        onInterlandChange({ ...interland, notes: nextNotes, auditLogs: nextAudits })
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-slate-700">{note.content}</p>
                <p className="mt-2 text-xs text-slate-500">{note.createdByName}</p>
              </article>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-slate-700">Geçmiş (Audit Trail)</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <DataTable data={sortedAudits} columns={auditColumns} onTableReady={setTable} />
          {table && <DataTablePagination table={table as TanStackTable<unknown>} />}
        </CardContent>
      </Card>
    </div>
  )
}
