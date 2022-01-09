import { appWithTranslation } from 'next-i18next'
import { Footer } from '../components/Footer'
import { GoogleTagManager } from '../components/tracking'
import { MetaBase, MetaPage } from '../components/meta'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <GoogleTagManager />
    <MetaBase />
    <MetaPage title="Fantasion" />
    <Component {...pageProps} />
    <Footer />
  </>
)

export default appWithTranslation(MyApp)
