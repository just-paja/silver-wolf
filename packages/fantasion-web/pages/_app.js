import { appWithTranslation } from 'next-i18next'
import { GoogleTagManager } from '../components/tracking'
import { MetaBase, MetaPage } from '../components/meta'
import { SSRProvider } from '@react-aria/ssr'

import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <GoogleTagManager />
    <MetaBase />
    <MetaPage title="Fantasion" />
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  </>
)

export default appWithTranslation(MyApp)
