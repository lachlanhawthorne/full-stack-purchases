  // id,
  // keyboardType,
  // validator,
  // title
  
import { YStack, Text, Input, XStack, Spinner, useThemeName, useTheme } from 'tamagui'
import { useMachine } from '@xstate/react'
import { inputValidatorMachine } from '@my/data'
import { CheckCircle, XCircle } from '@tamagui/feather-icons'

// get dark mode state from tamagui theme


export function InputWithValidator(props) {
  const [state, send] = useMachine(inputValidatorMachine({ validator: props.validator }), { devTools: true })
  const themeName = useThemeName()
  const theme = useTheme()

  return (
    <YStack
      {...props}
      space="$2"
      w="100%"
      ai="flex-start"
      jc="flex-start"
    >
      {
        props.title && (
          <Text
            fontFamily="$body"
            color="$gray6Dark"
            fontSize={14}
          >
            {props.title}
          </Text>
        )
      }
      <XStack
        w="100%"
        ai="center"
        space="$2"
        borderWidth={1}
        borderColor="$gray4Dark"
        borderRadius="$4"
      >
        <Input
          {...props}
          fontFamily="$body"
          color="#fff"
          fontSize={14}
          placeholder={props.placeholder}
          placeholderTextColor="rgba(255, 255, 255,  0.5)"
          h={48}
          f={1}
          px="$4"
          keyboardType={props.keyboardType}
          onChangeText={(value) => {
            send({ type: 'EDITED', value })
          }}
          value={props.value}
          borderColor="transparent"
          borderWidth={0}
          focusStyle={{
            borderWidth: 0,
            margin: 0
          }}
          keyboardAppearance={
            themeName === 'dark' ? 'dark' : 'light'
          }
          autoCapitalize={
            props.keyboardType === 'email-address' ? 'none' : 'sentences'
          }
        />
        <XStack width={40} ai="center">
          {
            state.matches('validating') && (
              <Spinner
              size="small"
              maxWidth={24}
              color="gray"
            />
            )
          }
          {
            state.matches('valid') && (
              <CheckCircle
                size={22}
                color={theme.green8 as any}
              />
            )
          }
          {
            state.matches('invalid') && (
              <XCircle
                size={22}
                color={theme.red8 as any}
              />
            )
          }
        </XStack>

      </XStack>


    </YStack>
  )
}

// export const InputWithValidator = styled(InputFrame, {
//   name: 'InputWithValidator',
//   bc: 'red',
// })
