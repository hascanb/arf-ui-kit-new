import { redirect } from "next/navigation"

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function LegacyDistancesRedirectPage({ searchParams }: Props) {
  const params = await searchParams
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value)
      continue
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item)
      }
    }
  }

  const nextPath = query.size
    ? `/arf/cargo/settings/system/distance-definitions?${query.toString()}`
    : "/arf/cargo/settings/system/distance-definitions"

  redirect(nextPath)
}
