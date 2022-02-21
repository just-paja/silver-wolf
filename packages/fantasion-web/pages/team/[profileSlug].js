import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { GenericPage } from '../../components/layout'
import { withPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { ProfileDetail } from '../../components/profiles'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const profileId = parseSlug(params.profileSlug)
  const profile = await fetch(`/profiles/${profileId}`)
  return {
    props: {
      profile,
      profileId,
    },
  }
})

const ProfilePage = ({ profile }) => (
  <GenericPage>
    <MetaPage title={profile.title} description={profile.description} />
    <ProfileDetail profile={profile} />
  </GenericPage>
)

export default asPage(ProfilePage)
