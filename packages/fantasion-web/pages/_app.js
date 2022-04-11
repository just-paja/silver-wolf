import { AlertProvider } from '../components/alerts'
import { appWithTranslation } from 'next-i18next'
import { MetaBase, MetaPage } from '../components/meta'
import { SiteContextProvider } from '../components/context'
import { SSRProvider } from '@react-aria/ssr'
import { Tracking } from '../components/tracking'

import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <Tracking />
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
