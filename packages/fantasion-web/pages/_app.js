import { AlertProvider } from '../components/alerts'
import { appWithTranslation } from 'next-i18next'
import { GoogleTagManager } from '../components/tracking'
import { MetaBase, MetaPage } from '../components/meta'
import { SiteContextProvider } from '../components/context'
import { SSRProvider } from '@react-aria/ssr'

import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <GoogleTagManager />
    <MetaBase />
    <MetaPage title="Fantasion" />
    <SSRProvider>
      <SiteContextProvider {...pageProps}>
        <AlertProvider>
          <Component {...pageProps} />
        </AlertProvider>
      </SiteContextProvider>
    </SSRProvider>
  </>
)

export default appWithTranslation(MyApp)
