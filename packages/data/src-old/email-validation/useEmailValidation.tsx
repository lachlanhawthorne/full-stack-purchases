import supabase from '../supabase'

import create from 'zustand/vanilla'
import { atom, useAtom, useAtomValue } from 'jotai'
import { atomWithStore } from 'jotai/zustand' // vanilla store
import { atomWithQuery } from 'jotai/query' // data fetching
import { atomWithMachine } from 'jotai/xstate'
import { assign, createMachine, interpret } from 'xstate'
import { inspect } from '@xstate/inspect'

// zustand for vanilla store
// const emailAtomStore = create((set) => '')
// const emailAtom = atomWithStore(emailAtomStore)

const emailAtom = atom('')

const validationQueryAtom = atomWithQuery((get) => ({
  queryKey: ['emailValidation', get(emailAtom)],
  queryFn: async (props) => {
    const { queryKey: [, email] } = props
    const { data, error } = await supabase.functions.invoke('validate-email', {
      body: JSON.stringify({ email }),
    })
    if (error) {
      throw error
    }
    return data
  },
}))

const validationMachine = (email: string) =>
/** @xstate-layout N4IgpgJg5mDOIC5QDcCGAbAlhVAXTA9gHYB026YAxAMoCqAQgLICSAKoqAA4Gyb7EcQAD0QBGACziSAZmkB2AEyi5ANhUBOABwqADOM0AaEAE8xmgKwl15yeb2aFciXoC+Lo2iw5+pdAVQQmERQlBDEYGREyAQA1hGe2HiEvv6BwQhB0QDGScQA2joAuoLcvD6CIgjmctIkmvqacloK6qIaCkamCM4k4k7SWqISmtIKDm4eGIk+JH4BQSFgAE5LBEsknOh4AGZrALYkCd7Js6kLGVEEOT4FxUggpXzJFWKSMvJKqhra9p2ImuorJoRuJquINOZRNUJiAjrlSNtUJh0ABXJZUOhMNglHhPAT3SoSKSyRTKNRaXT6P7deRWfqDYajcYwogECBwQRwmbkMA4srPAmIcwqEg6aw6Go2OTCmziamidSA9SSHTSUHqMY6FQKGFck5zNJQPl4ogvBBqnQkRTSRrmdSyNrmDomMRi3pyRQaFQ2vRacy6qbHYgkWAorJZODwe6PcqChAehRW5VElSiaSiW3ytW9FRyPqiLXWWTqANeeEkRHItG86O42OgSriZ1dVokFR2JuyfTVf3uWGB+HG+vCMzyzSinSTtQOtXA1RuNxAA */
createMachine<{ email: string }>({
  context: { email },
  id: 'validation',
  initial: 'idle',
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'loading',
          actions: assign({
            email: (_, { email }) => email,
          }),
        }
      },
    },
    loading: {
      invoke: {
        src: 'validateEmail',
        onDone: [
          {
            target: 'success',
          },
        ],
        onError: [
          {
            target: 'failure',
          },
        ],
      },
    },
    success: {
      type: 'final',
    },
    failure: {
      on: {
        SUBMIT: {
          target: 'loading',
        },
      },
    },
  }
}).withConfig({
  services: {
    validateEmail: async ({ email }) => {
      const { data, error } = await supabase.functions.invoke('validate-email', {
        body: JSON.stringify({ email: email }),
      })

      if (error) {
        throw error
      }
      return data
    },
  },
})

const validationAtom = atomWithMachine((get) => {
    console.log('emailAtom validationAtom', get(emailAtom))
    return validationMachine(get(emailAtom))
  }
)

export const useEmailValidation = () => {
  const [email, setEmail] = useAtom(emailAtom)
  const [state, send] = useAtom(validationAtom)

  return {
    email,
    setEmail,
    state,
    send,
  }
}

// const validationService = validationMachine().withConfig({
//   services: {
//     validateEmail: async (context) => {
//       console.log('validateEmail validationService')
//       console.log('context', context)
//       const { data, error } = await supabase.functions.invoke('validate-email', {
//         body: JSON.stringify({ email: context.email }),
//       })
//       if (error) {
//         throw error
//       }
//       return data
//     },
//   },
// })

// This code is merely useful to display the interactive state chart in a separate browser tab.
// As an alternative, can show and interact with it in VSCode via the XState VSCode extension if you prefer.
// if (typeof window !== "undefined") {
//   // browser code
//   inspect({
//     // options
//     url: 'https://statecharts.io/inspect', // (default)
//     iframe: false, // open in new window
//   });
//   const service = interpret(validationService, { devTools: true }).onTransition(
//     (state) => {
//       console.log(state.value);
//     }
//   );
//   service.start();
// }