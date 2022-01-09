import { appWithTranslation } from 'next-i18next'
import { MetaBase, MetaPage } from '../components/meta'
import { Footer } from '../components/Footer'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <MetaBase />
    <MetaPage title="Fantasion" />
    <Component {...pageProps} />
    <Footer />
  </>
)

export default appWithTranslation(MyApp)
