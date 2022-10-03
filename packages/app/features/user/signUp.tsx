import { Button, H1, Paragraph, YStack, Input, Label, Separator, Text, XStack, Form, Anchor  } from '@my/ui'
import { ArrowLeft, Github } from '@tamagui/feather-icons'
import React, { useEffect, useState } from 'react'
import { createParam } from 'solito'
import { useLink } from 'solito/link'
import { signUpMachine } from '@my/data'
import { useMachine } from '@xstate/react'

const { useParam } = createParam<{ id: string }>()

export function SignUpScreen() {
  const [id] = useParam('id')
  const linkProps = useLink({ href: '/auth' })

  const [state, send] = useMachine(signUpMachine, { devTools: true })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => console.log(state.value), [state])

  return (
    <YStack f={1} ai="center" jc="center">
      <YStack f={1} jc="center" ai="flex-start" width="100%" maxWidth={300} space={4}>
        <YStack space={14} w="100%">

          {
            // error from state context
            state.context.error && (
              <Paragraph color="red" fontFamily="$body" fontSize={14}>
                {state.context.error}
              </Paragraph>
            )
          }

          <H1>Sign up</H1>

          {state.matches('idle') && (
            <YStack>
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
                  disabled={state.matches('signingUp')}
                  mt={30}
                  onPress={(e) => {
                    e.preventDefault()
                    
                    send({ 
                      type: 'SIGN_UP',
                      email,
                      password,
                    })
                  }}
                >
                  {state.matches('signingUp') ? 'Loading...' : 'Sign up'}
                </Button>
              </Form>

              <Anchor {...linkProps} color="$gray6Dark" fontFamily="$body" fontSize={14}>
                Already have an account? Sign in
              </Anchor>
            </YStack>
          )}

          {state.matches('signedUp') && (
            <Paragraph color="green" fontFamily="$body" fontSize={14}>
              Signed up successfully! Please verify your email address
            </Paragraph>
          )}
        </YStack>

      </YStack>
    </YStack>
  )
}
