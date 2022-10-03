import { Button, H1, Paragraph, YStack, Input, Label, Separator, Text, XStack  } from '@my/ui'
import { ArrowLeft, Github } from '@tamagui/feather-icons'
import React, { useEffect, useContext } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'


import { AccountContext } from '../../state/auth'

const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')
  const linkProps = useLink({ href: '/' })

  const { useAuthMachine } = useContext(AccountContext) as any
  const [state, send] = useAuthMachine

  // if state.value === 'authenticated', redirect to home page
  useEffect(() => {
    if (state.matches('authenticated')) {
      linkProps.onPress()
    }
  }, [state.value])

  return (
    <YStack f={1} ai="center" jc="center">
      <YStack f={1} jc="center" ai="flex-start" width="100%" maxWidth={300} space={4}>
        <YStack space={14} w="100%">

          <XStack 
            space={8} 
            mb={18}
            cursor="pointer" 
            style={{color: 'rgb(255, 255, 255, 0.5)'} as any} 
            hoverStyle={{color: 'rgb(255, 255, 255)'} as any} 
            {...linkProps}
          >
            <ArrowLeft size={18} color="currentColor"/>
            <Text fontFamily="$body" color="inherit">Home</Text>
          </XStack>

          <H1>Sign in</H1>


          <Label htmlFor="authEmail">Email address</Label>
          <Input id="authEmail" w="100%" placeholder="name@example.com" /> 


          <XStack ai="center" space={8} my={8}>
            <Separator />
            <Text fontFamily="$body" color="$gray6Dark">OR</Text>
            <Separator />
          </XStack>

          <Button icon={Github} borderColor="$gray6Dark" w="100%">Sign in with GitHub</Button>
          
        </YStack>

      </YStack>
    </YStack>
  )
}
