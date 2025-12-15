'use server'

import { cookies } from 'next/headers'

export async function clearRecoveryMode() {
  const cookieStore = await cookies()
  cookieStore.delete('recovery_mode')
}
