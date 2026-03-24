import { Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Props {
  isSystem: boolean
}

export function SystemRoleBadge({ isSystem }: Props) {
  if (!isSystem) {
    return (
      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
        Ozel
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
      <Lock className="mr-1 size-3" />
      Sistem
    </Badge>
  )
}
