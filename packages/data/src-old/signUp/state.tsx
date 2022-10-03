import { assign, createMachine } from 'xstate'
import supabase from '../supabase'

type SignUpContext = {
  signedUp: boolean
  error: string | null
}

type SignUpEvent = {
  type: 'SIGN_UP'
  email: string
  password: string
}

export const signUpMachine = 
/** @xstate-layout N4IgpgJg5mDOIC5SwJZQHYFUAOA6FEANmAMQDKAkgOIByA+pgAqKjYD2qALim+iyAA9EAWgDMADlwAGAGxSA7AEYArOIBM4gCyap4mQBoQATxE7cmtQvWL5oxZvkzNAX2eHUGHLg-oU6KDgkELxg+OgAbmwA1qE+OPzsXDx8SMYiyoq4AJyW8o4ZaqKiTlmGQghFarjKyhp2WRmaiuKyru5oWHg+fgHYJGAATgNsA7jYhACGnABmIwC23h3xqYko3Lz85ZrZmlm78g6F8rUWhiYIirLmzVlF8lJSyvJZMlmubiDobBBw-HF4BGICQ4a2SmxEijUVVkCjUihymleWSkmjOIjUMnMuXENlEeQeMihbRA-0WGB6y1YIPWKVA5Xkkhk4hyjhRojhu1EaIQwgy2Vy+UhRRKxNJPkglJAqxp4J58OU5hkrycuiVtXE3OEDSxCiye00qme9lFS2wwKSG1S5WEcKyiuVOj0MnVmsUMnkOpxol0WXE4hqLneQA */
createMachine<SignUpContext, SignUpEvent>({
  context: { signedUp: false, error: null },
  id: 'signUp',
  initial: 'idle',
  states: {
    idle: {
      on: {
        SIGN_UP: {
          target: 'signingUp',
        },
      },
    },
    signingUp: {
      invoke: {
        src: async (context, e) => {
          const { email, password } = e as any
          const { user, session, error } = await supabase.auth.signUp({ email, password })

          if (error) throw error
          return { user, session }
        },
        id: 'signUpReq',
        onDone: {
          actions: [assign({ signedUp: true })],
          target: 'signedUp',
        },
        onError: { 
          actions: [assign({ error: (_, e) => e.data.message }) ]
        },
      },
    },
    signedUp: {
      type: 'final',
    },
  },
})


