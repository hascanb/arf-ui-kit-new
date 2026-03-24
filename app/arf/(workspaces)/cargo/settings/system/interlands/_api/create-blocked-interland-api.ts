import { blockedInterlandStore } from "../_mock/interlands-mock-data"
import type { BlockedInterlandPayload } from "../_types"

// TODO: Remove mock when API is ready
export async function createBlockedInterland(payload: BlockedInterlandPayload): Promise<void> {
  blockedInterlandStore.unshift(payload)
}
