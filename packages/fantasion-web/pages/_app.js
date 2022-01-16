import { appWithTranslation } from 'next-i18next'
import { GoogleTagManager } from '../components/tracking'
import { MetaBase, MetaPage } from '../components/meta'
import { Footer, PageContent } from '../components/layout'

import '../styles/globals.scss'

const MyApp = ({ Component, pageProps }) => (
  <>
    <GoogleTagManager />
    <MetaBase />
    <MetaPage title="Fantasion" />
    <PageContent>
      <Component {...pageProps} />
    </PageContent>
    <Footer />
  </>
)

export default appWithTranslation(MyApp)
