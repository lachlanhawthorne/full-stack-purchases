import { NavigationContainer, DarkTheme } from '@react-navigation/native'
import * as Linking from 'expo-linking'
import { useMemo } from 'react'

import { AccountProvider } from 'app/state/auth'

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountProvider>
      <NavigationContainer
        theme={DarkTheme}
        linking={useMemo(
          () => ({
            prefixes: [Linking.createURL('/')],
            config: {
              initialRouteName: 'home',
              screens: {
                home: '',
                'user-detail': 'user/:id',
                auth: 'auth',
                signUp: 'auth/signup'
              },
            },
          }),
          []
        )}
      >
        {children}
      </NavigationContainer>
    </AccountProvider>
    
  )
}
