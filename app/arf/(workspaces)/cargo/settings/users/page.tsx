import { redirect } from "next/navigation"

interface Props {
  searchParams: Promise<{ role?: string }>
}

export default async function SettingsUsersAliasPage({ searchParams }: Props) {
  const { role } = await searchParams
  if (role) {
    redirect(`/arf/cargo/settings/system/users?role=${encodeURIComponent(role)}`)
  }

  redirect("/arf/cargo/settings/system/users")
}
