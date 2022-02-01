import React from 'react'

import { apiFetch, NotFound } from '../../api'
import { asPage, MetaPage } from '../../components/meta'
import { asStatusCodePage } from '../../components/references'
import { GenericPage } from '../../components/layout'
import { getPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { ProfileDetail } from '../../components/profiles'

export const getProfile = async (profileId) => {
  try {
    return await apiFetch(`/profiles/${profileId}`)
  } catch (e) {
    if (e instanceof NotFound) {
      return null
    }
    throw e
  }
}

export const getServerSideProps = async (props) => {
  const profileId = parseSlug(props.params.profileSlug)
  const profile = await getProfile(profileId)
  return {
    props: {
      profile,
      profileId,
      statusCode: profile ? 200 : 404,
      ...(await getPageProps(props)).props,
    },
  }
}

const ProfilePage = ({ profile }) => (
  <GenericPage>
    <MetaPage title={profile.title} description={profile.description} />
    <ProfileDetail profile={profile} />
  </GenericPage>
)

export default asPage(asStatusCodePage(ProfilePage))
