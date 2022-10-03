import React, { useContext } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'


import { CheckSquare, DollarSign, User } from '@tamagui/feather-icons'

import { HomeScreen } from '../../features/home/screen'
import { AccountScreen } from '../../features/account/screen'
import { AuthScreen } from '../../features/user/auth'
import { SignUpScreen } from '../../features/user/signUp'
import { SubscriptionScreen } from '../../features/subscription/screen'

import { AccountContext } from 'app/state/auth'

const Tab = createBottomTabNavigator<{
  home: undefined
  account: undefined
  'user-detail': { id: string }
}>()

const Stack = createNativeStackNavigator<{
  auth: undefined
  signUp: undefined
}>()

function Auth() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="signUp" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export function NativeNavigation() {
  const { useAuthMachine } = useContext(AccountContext) as any
  const [state, send] = useAuthMachine

  return state.matches('signed_in') ? (
    <Tab.Navigator>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Todos',
          tabBarIcon: ({ color }) => <CheckSquare size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="user-detail"
        component={SubscriptionScreen}
        options={{
          title: 'Subscription',
          tabBarIcon: ({ color }) => <DollarSign size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="account"
        component={AccountScreen}
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  ) : (
    <Auth />
  )
}
