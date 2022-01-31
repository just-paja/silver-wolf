import React from 'react'

import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { LeisureCentre } from '../../components/leisureCentres'

export const getLeisureCentre = async (leisureCentreId) => {
  try {
    return await apiFetch(`/leisure-centres/${leisureCentreId}`)
  } catch (e) {
    if (e instanceof NotFound) {
      return null
    }
    throw e
  }
}

export const getServerSideProps = async (props) => {
  const leisureCentreId = parseSlug(props.params.leisureCentreSlug)
  const leisureCentre = await getLeisureCentre(leisureCentreId)
  return {
    props: {
      leisureCentreId,
      leisureCentre,
      statusCode: leisureCentre ? 200 : 404,
      ...(await getPageProps(props)).props,
    },
  }
}

const ExpeditionDetail = ({ leisureCentre }) => (
  <GenericPage>
    <MetaPage
      title={leisureCentre.title}
      description={leisureCentre.description}
    />
    <LeisureCentre leisureCentre={leisureCentre} />
  </GenericPage>
)

export default asPage(asStatusCodePage(ExpeditionDetail))
