import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { capitalize } from '../../api'
import { GenericPage } from '../../components/layout'
import { Heading, Main } from '../../components/media'
import { ParticipantList } from '../../components/family/ParticipantList'
import { ProfileLayout } from '../../components/family/ProfileLayout'
import { requireUser, withPageProps } from '../../server/props'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = withPageProps(
  requireUser(async ({ fetch }) => {
    const participants = await fetch('/participants')
    return { props: { participants } }
  })
)

const withEntityCollection = (Component, collectionName) =>
  function WithEntityCollection(props) {
    const passProps = { ...props }
    const defaultValue = props[collectionName]
    const [currentValue, setValue] = useState(defaultValue)
    const collection = capitalize(collectionName)
    const updateItem = (replacement) =>
      setValue({
        ...currentValue,
        results: currentValue.results.map((item) =>
          item.id === replacement.id ? replacement : item
        ),
      })
    passProps[collectionName] = currentValue
    passProps[`set${collection}`] = setValue
    passProps[`update${collection}Item`] = updateItem
    return <Component {...passProps} />
  }

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
        <Main>
          <Heading>{title}</Heading>
          <ParticipantList
            {...participants}
            onParticipantUpdate={updateParticipantsItem}
            className="mt-3"
          />
        </Main>
      </ProfileLayout>
    </GenericPage>
  )
}

export default asPage(withEntityCollection(ParticipantsPage, 'participants'))
