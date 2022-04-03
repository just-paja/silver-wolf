import Container from 'react-bootstrap/Container'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

export const getStaticProps = withPageProps(() => {})

const Custom404 = () => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('page-not-found')}
        description={t('page-not-found-description')}
      />
      <Container className="d-flex">
        <div className="text-center m-auto">
          <h1>{t('page-not-found')}</h1>
          <p>{t('page-not-found-description')}</p>
        </div>
      </Container>
    </GenericPage>
  )
}

export default asPage(Custom404)
