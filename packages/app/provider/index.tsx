import config from '../tamagui.config'
import { NavigationProvider } from './navigation'
import { TamaguiProvider, TamaguiProviderProps } from '@my/ui'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  // const signIn = async (email: string, password: string) => {
  //   const { error } = await supabase.auth.signIn({ email, password })
  //   if (error) {
  //     send({ type: 'ERROR', error })
  //   }
  // }
  // const signUp = async (email: string, password: string) => {

  return (
    <TamaguiProvider config={config} disableInjectCSS defaultTheme="dark" {...rest}>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </TamaguiProvider>
  )
}
