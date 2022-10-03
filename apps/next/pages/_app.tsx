import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import { Provider } from 'app/provider'
import Head from 'next/head'
import React, { useMemo, useEffect } from 'react'
import type { SolitoAppProps } from 'solito'
import 'raf/polyfill'
import { ClickToComponent } from 'click-to-react-component'

import { inspect } from '@xstate/inspect'

import { UserProvider } from '@supabase/auth-helpers-react';

import App from 'next/app'
import supabase from '@my/data/src/supabase'
import urqlClient from '@my/data/src/urql'
import { GetUserAccountDocument } from '@my/data/src/graphql/gql/graphql'

import { AccountProvider } from 'app/state/auth'

if (typeof window !== "undefined") {
  // browser code
  inspect({
    // options
    // iframe: false, // open in new window
    
    // select div to mount iframe
    iframe: false,
    url: 'https://statecharts.io/inspect',
  })
}

interface MySolitoAppProps extends SolitoAppProps {
  accountProps: any
}

function MyApp({ Component, pageProps, accountProps }: MySolitoAppProps) {

  const [theme, setTheme] = useRootTheme()

  const contents = useMemo(() => {
    return <Component {...pageProps} />
  }, [pageProps])

  return (
    <UserProvider supabaseClient={supabase}>
      <AccountProvider accountData={accountProps}>
        <ClickToComponent/>
        <Head>
          <title>Tamagui Example App</title>
          <meta name="description" content="Tamagui, Solito, Expo & Next.js" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <NextThemeProvider onChangeTheme={setTheme}>
          <Provider disableRootThemeClass defaultTheme={theme}>
            {contents}
          </Provider>
        </NextThemeProvider>
      </AccountProvider>
    </UserProvider>
  )
}

MyApp.getInitialProps = async (appContext: any) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const { data, token, error  } = await supabase
    .auth
    .api
    .getUserByCookie(appContext.ctx.req, appContext.ctx.res)

  if(data?.id) {
    const accountData = await urqlClient
      .query(GetUserAccountDocument, { id: data.id })
      .toPromise()
      .then((res) => res?.data?.accountCollection?.edges[0].node)
      
      return { 
        ...appProps, 
        accountProps: {
          ...data, 
          ...accountData
        }
      }
    }

  return { ...appProps }
}

export default MyApp
// validating input statemachine
// update name and email for user
// payments
// todos
