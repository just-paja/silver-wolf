import { appWithTranslation } from 'next-i18next'
import { GoogleTagManager } from '../components/tracking'
import { MetaBase, MetaPage } from '../components/meta'

import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <GoogleTagManager />
    <MetaBase />
    <MetaPage title="Fantasion" />
    <Component {...pageProps} />
  </>
)

export default appWithTranslation(MyApp)
