import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ResetPasswordForm } from './ResetPasswordForm'

export default async function ResetPasswordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/forgot-password?error=Your reset link has expired or is invalid. Please request a new one.')
  }

  return <ResetPasswordForm />
}
