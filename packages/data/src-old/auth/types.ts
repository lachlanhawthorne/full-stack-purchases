import type { AuthChangeEvent, AuthSession, AuthUser } from '@supabase/supabase-js'

export type AuthContext = {
  user: AuthUser | null
  session: AuthSession | null
  error: string | null
}

export type AuthEvent = {
  type: 'SIGN_IN'
  email: string
  password: string
} | {
  type: 'SIGN_UP'
  email: string
  password: string
} | {
  type: 'SIGN_OUT'
} | {
  type: 'AUTH_CHANGE'
  event: AuthChangeEvent
  user?: AuthUser
  session?: AuthSession
} | {
  type: 'SIGNED_IN'
  user?: AuthUser | null
  session?: AuthSession | null
} | {
  type: 'SIGNED_OUT'
} | {
  type: 'ERROR'
  error: string
}
