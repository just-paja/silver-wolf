import React from 'react'

import { asPage, MetaPage } from '../../../components/meta'
import { Breadcrumbs } from '../../../components/breadcrumbs'
import { GenericPage } from '../../../components/layout'
import { getFullName } from '../../../components/users'
import { ParticipantListItem } from '../../../components/family/ParticipantList'
import { ProfileLayout } from '../../../components/family/ProfileLayout'
import { requireUser, withPageProps } from '../../../server/props'
import { useTranslation } from 'next-i18next'
import { withEntity } from '../../../components/entities'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch, params }) => {
    const participant = await fetch(`/participants/${params.participantId}`)
    return { props: { participant } }
  })
)

const ParticipantDetailPage = ({ participant, setParticipant }) => {
  const { t } = useTranslation()
  const title = getFullName(participant)
  return (
    <GenericPage>
      <MetaPage
        title={title}
        description={t('family-participants-description')}
      />
      <ProfileLayout>
        <Breadcrumbs
          links={[
            {
              children: t('my-status'),
              route: 'status',
            },
            {
              children: t('family-participants'),
              route: 'participants',
            },
            {
              children: title,
            },
          ]}
        />
        <ParticipantListItem
          {...participant}
          onParticipantUpdate={setParticipant}
          className="mt-3"
        />
      </ProfileLayout>
    </GenericPage>
  )
}

export default asPage(withEntity(ParticipantDetailPage, 'participant'))
