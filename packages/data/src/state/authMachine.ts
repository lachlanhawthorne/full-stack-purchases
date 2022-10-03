import { StateFrom, createMachine, assign } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { NextRouter } from 'next/router';

import xstate from 'zustand-middleware-xstate'
import create from 'zustand/vanilla'

import supabase from '../supabase'
import urqlClient from '../urql';

import { GetUserAccountQuery, Account, GetUserAccountDocument } from '../graphql/gql/graphql'
import { send } from 'xstate/lib/actions';

export type AuthMachine = ReturnType<typeof createAuthMachine>;
export type AuthMachineState = StateFrom<AuthMachine>;

type AccountContext = {
  user?: Account | null,
  error?: Error | null,
  client: any,
  accountData?: any,
}

type AccountEvents = {
  type: 'SIGNED_IN',
} | {
  type: 'SIGN_IN',
  email: string,
  password: string,
} | {
  type: 'SIGN_OUT',
} | {
  type: 'CHOOSE_PROVIDER',
} | {
  type: 'CANCEL_PROVIDER',
} | {
  type: 'LOGGED_OUT_USER_ATTEMPTED_RESTRICTED_ACTION',
}

export const createAuthMachine = (
    // router: NextRouter;
    // isEmbbeded: boolean;
    accountData?: any
) =>
/** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgJYDtd1dkAbXALwKgGJFQAHAe1iNyf3pAA9EBGAGwBWbAIAMATgDMAFglCpAdhkAOMSqEAaEAE9EAJhlTRA04qFj90oQJUyAvve1os2AMaYwbgNbUA+rgAZn6sUPiQAfh0SCDMrMQcXLwIMor62Ap8glJ8+ooq5sraegh8KummZvL6eTL6No7OGDih4RB+TBjumEws-gwATkwAbrgQYAM0AMoAkgDiAHJ+MwtccWyJMclZigLYchISMuKK0op8UsWIKhJiJqZCMmLiNVL6jSAuLbhhEZ3o3V6rHwUD8gxGYwmNAAwgBBBbQgCiABk-AAFABKAHkAGozAAiiIxaz6CU4W2uAj42D4TyE8jEMie8j4VwQuz2lWEijEQiEKguEg+X2wrT+GBhAAksVipoj0di8YTiTF1mSkgYrNhzgUZHznlS6io2QLjCopBa+BIarcjophc1RT82h0JcisXM5oj8X4sQBVAAqfj9coxflhAYDiIAsmioz6MYipgGMTNofHw+mZljVqrSexyaBkjbtWVlPrTLT9MbdIhdiJzRb9EoaqpeQ7XGL2gRsIEwOgPNQ-bAoRMhgNsAxSMh0IEmAMALbYEVdyK9-uDkHDiYIAjDJhuGcFgDaYgAuiT4gWNQgCnt9GIpGJ1HxzhIeRI2TlFBln2JBHw-5WDcHbfL83ZRLMiy+oGl4bIWPCIEI+hsuYKjYI2by0oUBT2k4nzNNM8wLN6yy5ow+abEWiB1GydQyDSXLlDceTlI4+H4Ew4zwDEIoEGwZCUNQcHqhSKQobWCDNuhghmEIij5PUTIOPhIoeF4vgggEwSrgQInXmJeR3AcDLyXkNifpJ0mMXJCnlI8TKgU64GugCYykGA+lUYhpS8j+JkyHw-L0hoMioVSNncmoqRZEITmrv8gJ9Fp4KjOMAxeQhyQCKc2BiPkgGAVIyG7BJJS7BIkU2GoVICu8qmOglGCZTeD4iDq5YWJWRpsjlP6ycIEixdWzbxc6EQ9n2A6YEOI4ZXmV7edl755TktIPPouQCl+zx5X+r70ragVjS5PbuZ5C3wTeRXGZtijFTyFh1GViCWvshwSAKwgPuoUgnS6emXaJ1EIDlxiPlkxzfVtrKSWU4N-m1Ry2Mc-3+IDFGLVl-DVuhVi2M8hWBZZ5WffcUWMucQWgS1YllGyWTkwU-6vmWNTsfYQA */
createMachine<AccountContext, AccountEvents>(
  {
    preserveActionOrder: true,
    predictableActionArguments: true,
    id: 'auth',
    initial: accountData?.id ? 'signed_in': 'initializing',
    context: {
      client: supabase,
      user: null,
      accountData: accountData || null,
    },
    invoke: {
      src: (ctx) => (sendBack) => {
        if (ctx.client.auth.session()) {
          sendBack({ type: 'SIGNED_IN' })
        }
        console.log('hello from authmachine')
        ctx.client.auth.onAuthStateChange((state) => {
          // we only care about SIGNED_IN because signing out is "synchronous" from our perspective anyway
          // and is handled in response to user actions
          console.log('onAuthStateChange', state)

          if (state === 'SIGNED_IN') {
            sendBack({ type: 'SIGNED_IN' })
          }
        })
      },
    },
    on: {
      SIGNED_IN: {
        target: 'signed_in',
        internal: true,
      },
    },
    states: {
      initializing: {
        always: {
          target: 'checking_if_signed_in',
        },
      },
      checking_if_signed_in: {
        always: [
          {
            cond: (ctx) => Boolean(ctx.client.auth.session()),
            target: 'signed_in',
          },
          {
            target: 'signed_out',
          },
        ],
      },
      signed_out: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              SIGN_IN: {
                target: 'authenticating',
              }
            }
          },
          // choosing_provider: {
          //   on: {
          //     SIGN_IN: {
          //       target: '#auth.signing_in',
          //     },
          //     CANCEL_PROVIDER: {
          //       target: 'idle',
          //     },
          //   },
          // },
          authenticating: {
            invoke: {
              src: (ctx, event: any) => (sendBack) => {
                console.log(event)
                return ctx.client.auth
                  .signIn({
                    email: event.email,
                    password: event.password
                  })
                  .then(({ error, session, user }) => {
                    if(error) throw error;
                    return { session, user }
                  })
              },

              onDone: {
                actions: [
                  () => (sendBack) => {
                    sendBack({ type: 'SIGNED_IN' })
                  }
                ]
              },
              onError: {
                actions: [
                  assign((ctx, e) => ({ error: e.data?.message }))
                ],
                target: '#auth.signed_out.idle'
              },
            }
          },
          

        },
        on: {
          // CHOOSE_PROVIDER: {
          //   target: '.choosing_provider',
          // },
          // LOGGED_OUT_USER_ATTEMPTED_RESTRICTED_ACTION: {
          //   target: '.choosing_provider',
          // },
          SIGN_IN: {
            target: '.authenticating',
          },
          SIGNED_IN: {
            target: '#auth.signed_in'
          }
        },
      },
      signed_in: {
        // exit: send(sourceModel.events.LOGGED_IN_USER_ID_UPDATED(null), {
        //   to: (ctx) => ctx.sourceRef!,
        // }),
        // above sends event to sourceModel machine, which is not needed
        tags: 'authorized',
        initial: 'fetchingUser',
        states: {
          fetchingUser: {
            invoke: {
              src: async (ctx): Promise<Account | undefined> => {
                return urqlClient
                  .query(GetUserAccountDocument, { id: ctx.client.auth.user()?.id })
                  .toPromise()
                  .then(({ data }) => {
                    return data?.accountCollection?.edges?.[0]?.node;
                  })
              },
              onDone: {
                target: 'idle',
                actions: [
                  assign(
                    (ctx, event) => ({ accountData: event.data })
                  )
                ]
              },
              onError: [
                {
                  actions: [
                    (ctx, event) => console.log('error', event.data),
                  ],
                },
              ],
            },
          },
          idle: {},
        },
        on: {
          SIGN_OUT: {
            actions: [
              'signOutUser',
              assign((ctx, e) => ({ accountData: null }))
            ],
            target: 'signed_out',
          },
        },
      },
      signing_in: {
        entry: 'signInUser',
        description:
          '\n            Calling signInUser redirects us away from this\n            page - this is modelled as a final state because\n            the state machine is stopped and recreated when\n            the user gets redirected back.\n          ',
        type: 'final',
      },
    },
    
  },
  {
    actions: {
      signInUser: (ctx, e) => {
        // ctx.client.auth.signIn(
        //   { provider: (e as any).provider },
        //   { redirectTo: window.location.href },
        // );

        ctx.client.auth.signIn(
          { email: (e as any).email, password: (e as any).password },
        );
      },
      signOutUser: (ctx) => {
        // This synchronously removes locally stored token and asynchronously revokes all (😢) refresh tokens.
        // Retrying this isn't possible using the public API of the auth client because the access token is no longer available then.
        // So we just ignore a possible error here as it's not really actionable.
        // However, the token won't be available on this machine anymore so, in a sense, the signing out is always successful.
        ctx.client.auth.signOut().catch(() => {})
        assign({ accountData: null })
      },
    },
  },
);

export const getSupabaseClient = (state: AuthMachineState) => {
  return state.context.client;
};

// export const useAuthStore = create(xstate(createAuthMachine()))