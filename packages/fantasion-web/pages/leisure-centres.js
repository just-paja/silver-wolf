import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { withPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'
import { apiFetch } from '../api'
import { LeisureCentreList } from '../components/leisureCentres'

const fetchLeisureCentres = async () => await apiFetch('/leisure-centres')

export const getServerSideProps = withPageProps(async () => ({
  props: {
    leisureCentres: await fetchLeisureCentres(),
  },
}))

const LeisureCentresPage = ({ leisureCentres }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('leisure-centre-title')}
        description={t('fantasion-general-description')}
      />
      <LeisureCentreList leisureCentres={leisureCentres.results} />
    </GenericPage>
  )
}

export default asPage(LeisureCentresPage)
