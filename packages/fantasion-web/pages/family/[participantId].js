import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { GenericPage } from '../../components/layout'
import { Heading, Main } from '../../components/media'
import { ParticipantListItem } from '../../components/family/ParticipantList'
import { ProfileLayout } from '../../components/family/ProfileLayout'
import { requireUser, withPageProps } from '../../server/props'
import { useTranslation } from 'next-i18next'
import { withEntity } from '../../components/entities'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch, params }) => {
    const participant = await fetch(`/participants/${params.participantId}`)
    return { props: { participant } }
  })
)

const ParticipantDetailPage = ({ participant, setParticipants }) => {
  const { t } = useTranslation()
  const title = t('family-participants')
  return (
    <GenericPage>
      <MetaPage
        title={title}
        description={t('family-participants-description')}
      />
      <ProfileLayout>
        <Main>
          <Heading>{title}</Heading>
          <ParticipantListItem
            {...participant}
            onParticipantUpdate={setParticipants}
            className="mt-3"
          />
        </Main>
      </ProfileLayout>
    </GenericPage>
  )
}

export default asPage(withEntity(ParticipantDetailPage, 'participant'))
