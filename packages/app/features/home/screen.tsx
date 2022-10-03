import { Anchor, Button, H1, Paragraph, Separator, XStack, YStack, Sheet, Text, InputWithValidator } from '@my/ui'
import { ChevronDown, ChevronUp, User, LogOut } from '@tamagui/feather-icons'
import { useContext, useEffect, createContext } from 'react'
import { useLink } from 'solito/link'
import { useMachine } from '@xstate/react'
import { AccountContext } from 'app/state/auth'
import { supabase } from '@my/data'

import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, View } from 'react-native'
import type { SupabaseClient } from '@supabase/supabase-js'

export function HomeScreen() {
  const linkProps = useLink({
    href: '/auth',
  })

  const { useAuthMachine } = useContext(AccountContext) as any
  const [state, send] = useAuthMachine

  return (
    <TouchableWithoutFeedback 
      onPress={
        Platform.OS === 'web' ? undefined : Keyboard.dismiss
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
         <ScrollView 
          keyboardShouldPersistTaps={'handled'} 
          contentContainerStyle={{ 
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            flexGrow: 1,
            width: '100%',
          }}
        >
          <YStack f={1} jc="center" ai="center" p="$4" space width="100%">
            <YStack space="$4" maw={400} w="100%">
              <H1 ta="center">💸</H1>
              <YStack>
                <Text fontFamily="$body" color="#fff" fontWeight="600" fontSize={28} ta="center">
                  fullstack-purchases
                </Text>
                
                <InputWithValidator
                  id="email"
                  keyboardType="email-address"
                  placeholder="example@email.com"
                  validator={(email: string) => 
                    supabase.functions.invoke('validate-email', {
                      body: JSON.stringify({ email }),
                    })
                    .then(({data, error}) => {
                      if(error) throw new Error(error.message)
                      return {
                        valid: data.message.valid,
                        validators: data.message.validators
                      }
                    })
                  }
                  title="Email"
                />
              </YStack>

              <Button onPress={() => send({ type: 'SIGN_OUT' })}>Sign out</Button>
            </YStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  )
}