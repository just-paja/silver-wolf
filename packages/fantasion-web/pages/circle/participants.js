import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { Breadcrumbs } from '../../components/breadcrumbs'
import { GenericPage } from '../../components/layout'
import { Heading } from '../../components/media'
import { ParticipantList } from '../../components/family/ParticipantList'
import { ProfileLayout } from '../../components/family/ProfileLayout'
import { requireUser, withPageProps } from '../../server/props'
import { useTranslation } from 'next-i18next'
import { withEntityCollection } from '../../components/entities'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const participants = await fetch('/participants')
    return { props: { participants } }
  })
)

const ParticipantsPage = ({ participants, updateParticipantsItem }) => {
  const { t } = useTranslation()
  const title = t('family-participants')
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
              children: title,
            },
          ]}
        />
        <Heading>{title}</Heading>
        <ParticipantList
          {...participants}
          onParticipantUpdate={updateParticipantsItem}
          className="mt-3"
        />
      </ProfileLayout>
    </GenericPage>
  )
}

export default asPage(withEntityCollection(ParticipantsPage, 'participants'))
