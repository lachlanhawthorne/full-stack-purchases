import { Button, H1, Paragraph, YStack, Input, Label, Separator, Text, XStack, Form, Anchor  } from '@my/ui'
import { ArrowLeft, Github } from '@tamagui/feather-icons'
import React, { useContext, useEffect, useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { AccountContext } from '../../state/auth'

const { useParam } = createParam<{ id: string }>()

export function AuthScreen() {
  const [id] = useParam('id')

  const { useAuthMachine } = useContext(AccountContext) as any
  const [state, send] = useAuthMachine

  const homeLink = useLink({ href: '/' }) 
  const signUpLink = useLink({ href: '/auth/signup' })

  // if state.value === 'authenticated', redirect to home page
  useEffect(() => {
    if (state.matches('authenticated')) {
       homeLink.onPress()
    }
  }, [state])


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <YStack f={1} ai="center" jc="center">
      <YStack f={1} jc="center" ai="flex-start" width="100%" maxWidth={300} space={4}>
        <YStack space={14} w="100%">

          {/* <XStack 
            space={8} 
            mb={18}
            cursor="pointer" 
            style={{color: 'rgb(255, 255, 255, 0.5)'} as any} 
            hoverStyle={{color: 'rgb(255, 255, 255)'} as any} 
            {...homeLink}
          >
            <ArrowLeft size={18} color="currentColor"/>
            <Text fontFamily="$body" color="inherit">Home</Text>
          </XStack> */}

          {
            // error from state context
            state.context.error && (
              <Paragraph color="red" fontFamily="$body" fontSize={14}>
                {state.context.error}
              </Paragraph>
            )
          }

          <H1>Sign in</H1>

          <Form>

            <Label>Email Address</Label>
            <Input
              // @ts-ignore
              name='email'
              w="100%" id='email'  
              textContentType='emailAddress'
              onChange={(e) => setEmail(e.nativeEvent.text)}
              onSubmitEditing={(e) => setEmail(e.nativeEvent.text)}
              value={email}
            />

            <Label>Password</Label>
            <Input
              // @ts-ignore
              name='password'
              w="100%" 
              id='email'  
              textContentType='password' 
              secureTextEntry={true}
              onChange={(e) => setPassword(e.nativeEvent.text)}
              onSubmitEditing={(e) => setPassword(e.nativeEvent.text)}
              value={password}
            />

            <Button 
              // @ts-ignore
              type="submit" 
              borderColor="$gray6Dark"
              w="100%" 
              disabled={state.matches('loading')}
              mt={30}
              onPress={(e) => {
                e.preventDefault()
                
                send({ 
                  type: 'SIGN_IN',
                  email,
                  password,
                 })
              }}
            >
              Sign in
            </Button>
          </Form>

          <XStack ai="center" space={8} my={8}>
            <Separator />
            <Text fontFamily="$body" color="$gray6Dark">OR</Text>
            <Separator />
          </XStack>

          <Button icon={Github} borderColor="$gray6Dark" w="100%">Sign in with GitHub</Button>
          
          <Anchor color="$gray6Dark" fontFamily="$body" fontSize={14} {...signUpLink}>
            Don't have an account? Sign up
          </Anchor>
        </YStack>

      </YStack>
    </YStack>
  )
}
