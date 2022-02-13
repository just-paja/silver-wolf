import Container from 'react-bootstrap/Container'
import React from 'react'

import { apiFetch } from '../api'
import { asPage, MetaPage } from '../components/meta'
import { CreatePasswordForm } from '../components/register'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'
import { setCookies } from 'cookies-next'

export const getVerification = async (secret) =>
  await apiFetch(`/users/create-password/${secret}`)

const TOKEN_COOKIE = 'authToken'

export const getServerSideProps = withPageProps(async (props) => {
  const keys = Object.keys(props.query)
  const secret = keys[0]
  const { user, token } = await getVerification(secret)
  setCookies(TOKEN_COOKIE, token, props)
  return {
    props: {
      secret,
      token,
      user,
    },
  }
})

const VerifyEmailPage = () => {
  const { t } = useTranslation()
  const onSubmit = async (values) => {
    const res = await apiFetch('/users/create-password', {
      body: JSON.stringify(values),
      method: 'POST',
    })
    console.log(res)
  }
  return (
    <GenericPage>
      <MetaPage
        title={t('verification-title')}
        description={t('verification-general-description')}
      />
      <Container>
        <Heading>{t('verification-title')}</Heading>
        <hr />
        <div>
          <p>{t('verification-success')}</p>
          <CreatePasswordForm onSubmit={onSubmit} />
        </div>
      </Container>
    </GenericPage>
  )
}

export default asPage(VerifyEmailPage)
