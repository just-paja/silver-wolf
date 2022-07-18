import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import React, { useState } from 'react'

import { asPage, MetaPage } from '../components/meta'
import { CreatePasswordForm } from '../components/register'
import { ForgottenPasswordForm } from '../components/login'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { useAlerts, useSite } from '../components/context'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

const restorePassword = async (fetch, values) =>
  await fetch.post('/users/restore-password', {
    body: values,
  })

const getVerification = async (fetch, secret) =>
  await fetch(`/users/verifications/${secret}`)

const parseSecret = (query) => query.s || null

export const getServerSideProps = withPageProps(async ({ fetch, query }) => {
  const secret = parseSecret(query)
  let token = null
  if (secret) {
    const res = await getVerification(fetch, secret)
    token = res.token
  }
  return {
    props: {
      secret,
      token,
    },
  }
})

const ForgottenPasswordPage = ({ secret, token }) => {
  const alerts = useAlerts()
  const { fetch } = useSite()
  const { t } = useTranslation()
  const [submitted, setSubmitted] = useState()
  const requestPasswordRestore = async (values) => {
    await restorePassword(fetch, values)
    setSubmitted(true)
    alerts.add({
      id: 'renewed-password',
      severity: 'success',
      text: t('forgotten-password-submitted'),
    })
  }

  let content = (
    <div>
      <Heading>{t('forgotten-password-title')}</Heading>
      <hr />
      <div>
        <p>{t('forgotten-password-description')}</p>
        <ForgottenPasswordForm onSubmit={requestPasswordRestore} />
      </div>
    </div>
  )
  if (token) {
    const createPassword = async (values) => {
      await fetch.post(`/users/create-password/${secret}`, {
        body: values,
      })
      setSubmitted(true)
      alerts.add({
        id: 'restored-password',
        severity: 'success',
        text: t('forgotten-password-restored'),
      })
    }
    content = (
      <div>
        <Heading>{t('restore-password-title')}</Heading>
        <hr />
        <div>
          <p>{t('restore-password-description')}</p>
          <CreatePasswordForm onSubmit={createPassword} />
        </div>
      </div>
    )
  }
  return (
    <GenericPage>
      <MetaPage
        title={t('forgotten-password-title')}
        description={t('forgotten-password-description')}
      />
      <Container>
        <Row>
          <Col lg={{ offset: 3, span: 6 }}>
            <Collapse in={!submitted}>{content}</Collapse>
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(ForgottenPasswordPage)
