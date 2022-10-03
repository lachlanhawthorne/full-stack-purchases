import { assign, createMachine } from 'xstate'
import { createModel } from 'xstate/lib/model'
import xstate from 'zustand-middleware-xstate'
import create from 'zustand/vanilla'

import { Account }  from '../../graphql/gql/graphql'

import supabase from '../supabase'

const authModel = createModel({
  client: supabase,
  userAccountData: null as Account | null
})

// import type { AuthContext, AuthEvent } from './types'

// export const authMachine = 
// /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOjVsAdugJYDGy6kAxAMoCSA4gHICiAIgPoDyAqgCqJQABwD2sYiREFBIAB6IAbAA4AnNgDMARgDs2zQAYlC-fs1aANCACeiAKwqATNiXb1Ch7tv2HSgCwBff0s8HFQCEMISckoIWkZWTjomGVFxSWkkOUQHd2xtBR0HXxdHH3VLGwQPNRUvfQUVWod9FSVbQKCQAhEIOBkQ3AxMSLIKSBSxCWIpGXkEIydNJWXNHM0FdXVGisRfDex9PXrfB1sT-IVA4KHsMIiiUZiJtOmM0DnfbR2EBXyNdWKWjMvnUtk07U6IWeUxmmTmDnK1kQq302Fqtn0tj8bmarm0HX8QA */
// createMachine<AuthContext, AuthEvent>({
//   context: { 
//     user: null, 
//     session: null, 
//     error: null 
//   },
//   // invoke: ,
//   id: 'auth',
//   initial: 'unauthenticated',
//   invoke: [{
//     id: 'supabase_auth',
//     src: () => (sendBack) => {
//       supabase.auth.onAuthStateChange((event, session) => {
//         switch(event) {
//           case 'SIGNED_IN':
//             console.log('SIGNED_IN', session)
//             if(session?.user) return sendBack({ type: 'SIGNED_IN', session, user: session.user })
//             break
//           case 'SIGNED_OUT':
//             sendBack({ type: 'SIGNED_OUT' })
//             break
//           case 'USER_UPDATED':
//             // if(session?.user) return sendBack({ type: 'AUTH_CHANGE', user: session.user })
//             break
//           default:
//             break
//         }
//       })
//     },
//     onDone: {
//       actions: [
//         (context, event) => {
//           // event.data.unsubscribe()
//           console.log('onDone', event)
//         }
//       ]
//     },
//   }],
//   states: {
//     unauthenticated: {
//       // invoke: [{
//       //   id:'inital_auth_query',
//       //   src: (context, event: any) => {
//       //     return Promise.all([supabase.auth.user(), supabase.auth.session()])
//       //     .then(([user, session]) => {
//       //       if(!user || !session) {
//       //         return Promise.reject('No user or session')
//       //       }
//       //       return { user, session }
//       //     })
//       //   },
//       //   onDone: {
//       //     actions: ['setUser', 'setSession'],
//       //     target: 'authenticated',
//       //   },

//       //   onError: {
//       //     actions: [
//       //       () => {}
//       //     ]
//       //   }
        
//       // }],
//       on: {
//         SIGN_IN: {
//           target: 'authenticating',
//         },
//         SIGNED_IN: {
//           actions: ['setUser', 'setSession'],
//           target: 'authenticated',
//         }
//       },
//     },
//     unauthenticating: {
//       invoke: [{
//         id: 'signOut',
//         src: () => Promise.resolve(supabase.auth.signOut()),
//         onDone: {
//           actions: ['clearUser', 'clearSession'],
//           target: 'unauthenticated',
//         },
//         onError: {
//           target: 'authenticated'
//         }
//       }],
//     },
//     authenticated: {
//       on: {
//         SIGN_OUT: {
//           target: 'unauthenticating'
//         },
//       },
//     },
//     authenticating: {
//       entry: ['clearError'],
//       invoke: [
//         {
//           id: 'sign-in',
//           src: (context, event: any) => {
//             return Promise.resolve(
//               supabase
//                 .auth
//                 .signIn({ email: event.email, password: event.password })
//                 .then(({ user, session, error }) => {
//                   if(error) throw error
//                   return { user, session }
//                 })
//             )
//           },
//           onDone: {
//             actions: ['setUser', 'setSession'],
//             target: 'authenticated',
//           },
//           onError: {
//             actions: ['setError'],
//             target: 'unauthenticated',
//           }
//         }
//       ]
//     }
//   },
// },
// {
//   actions: {
//     clearSession: assign((_, e) => ({ session: null })),
//     clearUser: assign((_, e) => ({ user: null })),
//     clearError: assign((_, e) => ({ error: null })),
//     setSession: assign((_, e: any) => ({ session: e.data?.session ?? null })),
//     setUser: assign((_, e: any) => ({ user: e.data?.user ?? null })),
//     setError: assign((_, e: any) => ({ error: e.data?.message ?? null })),
//   }
// })

// export const useAuthStore = create(xstate(authMachine))