// import createStore from 'zustand/vanilla'
// import { configurePersist } from 'zustand-persist'
// import AsyncStorage from '@react-native-community/async-storage'

// const { persist, purge } = configurePersist({
//   storage: AsyncStorage,
// }) as any

// interface AuthStore {
//   isAuthenticated?: boolean
//   isAuthenticating?: boolean
//   errorMessage?: string
//   user?: {
//     name: string
//     email: string
//   }
//   login?: () => void
//   logout?: () => void
// }

// const useAuthStore = createStore<AuthStore>(
//   persist(
//     {
//       key: 'auth',
//       allowlist: ['isAuthenticated', 'user'],
//     },
//     (set) => ({
//       isAuthenticated: false,
//       isAuthenticating: false,
//       errorMessage: '',
//       user: undefined,
//       login: async () => {
//         set((state) => ({ isAuthenticating: true }))
//         await new Promise((resolve) => setTimeout(resolve, 1000))
//         set((state) => ({
//           isAuthenticated: true,
//           isAuthenticating: false,
//           user: {
//             name: 'Steven',
//             email: 'example@gmail.com',
//           },
//         }))
//       },
//       logout: async () => {
//         set((state) => ({ isAuthenticated: false }))
//       },
//     })
//   )
// )

// // weird typescript errors 
// // TODO: store localStorage and AsyncStorage in a variable


// // https://github.com/roadmanfong/zustand-persist/blob/master/example/src/stores/useAuthStore.ts