import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { GenericPage } from '../../components/layout'
import { LeisureCentre } from '../../components/leisureCentres'
import { parseSlug } from '../../components/slugs'
import { withPageProps } from '../../server/props'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const leisureCentreId = parseSlug(params.leisureCentreSlug)
  const leisureCentre = await fetch(`/leisure-centres/${leisureCentreId}`)
  return {
    props: {
      leisureCentreId,
      leisureCentre,
    },
  }
})

const ExpeditionDetail = ({ leisureCentre }) => (
  <GenericPage>
    <MetaPage
      title={leisureCentre.title}
      description={leisureCentre.description}
    />
    <LeisureCentre leisureCentre={leisureCentre} />
  </GenericPage>
)

export default asPage(ExpeditionDetail)
