import { createAuthMachine } from '@my/data'
import { useMachine } from '@xstate/react'
import createStore from 'zustand'

import { createContext, useState } from 'react'

export const AccountContext = createContext(null) as any

export const AccountProvider = ({ children, accountData }: any) => {
  const authMachine = createAuthMachine(accountData)
  const useAuthMachine = useMachine(authMachine)

  const supabase  = useAuthMachine[0].context.client

  return (
    <AccountContext.Provider value={{ useAuthMachine, supabase }}>
      {children}
    </AccountContext.Provider>
  )
}
