import { useContext } from 'react'
import { Label, YStack, Paragraph, H1, Button, Input } from '@my/ui'
import { LogOut } from '@tamagui/feather-icons'
import { AccountContext } from 'app/state/auth'

export function AccountScreen() {
  const { useAuthMachine } = useContext(AccountContext) as any
  const [state, send] = useAuthMachine

  return (
    <YStack f={1} ai="center" jc="center">
      <YStack f={1} jc="center" ai="flex-start" width="100%" maxWidth={300} space={4}>
        <YStack space={14} w="100%">
          <H1>Account</H1>
        </YStack>

        <YStack my={16} w="100%">
          <YStack w="100%">
            <Label mb={0}>Name</Label>
            <Input defaultValue='Lachlan Hawthorne' onChange={
              (e) => console.log(e.nativeEvent.text)
            }/>
          </YStack>

          <YStack w="100%">
            <Label mb={0}>Email Address</Label>
            <Input defaultValue={state.context.user?.email} onChange={
              (e) => console.log(e.nativeEvent.text)
            }/>
          </YStack>
        </YStack>

        <Button w={300} icon={LogOut} bg="$gray1Dark" onPress={() => send({ type: 'SIGN_OUT' })}>Sign out</Button>

      </YStack>
    </YStack>
  )
}