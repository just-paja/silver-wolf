import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../../../components/meta'
import { Breadcrumbs } from '../../../components/breadcrumbs'
import { DateRange, formatDateRange } from '../../../components/dates'
import { GenericPage } from '../../../components/layout'
import { Heading } from '../../../components/media'
import { parseSlug } from '../../../components/slugs'
import { slug } from '../../../components/slugs'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../../../server/props'
import { ParticipantForm } from '../../../components/signups'
import { ExpeditionContext } from '../../../components/expeditions'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const expeditionId = parseSlug(params.expeditionSlug)
  const expedition = await fetch(`/expeditions/${expeditionId}`)
  return {
    props: {
      expeditionId,
      expedition,
    },
  }
})

const ExpeditionBatchSignupPage = ({ expedition }) => {
  const { t } = useTranslation()
  const title = `${expedition.title}: ${t('expedition-signup')}`
  return (
    <ExpeditionContext.Provider value={expedition}>
      <GenericPage>
        <MetaPage title={title} description={expedition.description} />
        <Container as="article" className="mt-3">
          <Breadcrumbs
            links={[
              { route: 'adventureList', children: t('adventures-title') },
              {
                route: 'expeditionDetail',
                params: { expeditionSlug: slug(expedition) },
                children: expedition.title,
              },
              {
                children: t('expedition-signup'),
              },
            ]}
          />
          <header>
            <Heading>
              {t('expedition-signup-on', { expeditionTitle: expedition.title })}
            </Heading>
          </header>
          <ParticipantForm onSubmit={(values) => console.log(values)} />
        </Container>
      </GenericPage>
    </ExpeditionContext.Provider>
  )
}

export default asPage(ExpeditionBatchSignupPage)
