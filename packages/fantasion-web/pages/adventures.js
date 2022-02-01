import React from 'react'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
import { useTranslation } from 'next-i18next'
import { apiFetch } from '../api'
import { ExpeditionThemeList } from '../components/expeditionThemes'

const fetchExpeditionThemes = async () => await apiFetch('/expedition-themes')

export const getServerSideProps = async (props) => {
  return {
    props: {
      ...(await getPageProps(props)).props,
      expeditionThemes: await fetchExpeditionThemes(),
    },
  }
}

const AdventuresPage = ({ expeditionThemes }) => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('adventures-title')}
        description={t('adventures-general-description')}
      />
      <ExpeditionThemeList expeditionThemes={expeditionThemes.results} />
    </GenericPage>
  )
}

export default asPage(AdventuresPage)
