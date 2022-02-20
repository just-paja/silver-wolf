import Collapse from 'react-bootstrap/Collapse'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import React, { useState } from 'react'

import { asPage, MetaPage } from '../components/meta'
import { CreatePasswordForm } from '../components/register'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { setCookies } from 'cookies-next'
import { TOKEN_COOKIE } from '../api'
import { useAlerts } from '../components/alerts'
import { useSite } from '../components/context'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

const getVerification = async (fetch, secret) =>
  await fetch(`/users/verifications/${secret}`)

const createPassword = (fetch, secret) => async (values) =>
  await fetch(`/users/create-password/${secret}`, {
    body: JSON.stringify(values),
    method: 'POST',
  })

const parseSecret = (query) => Object.keys(query)[0]

export const getServerSideProps = withPageProps(
  async ({ fetch, query, req, res }) => {
    const secret = parseSecret(query)
    const { user, token } = await getVerification(fetch, secret)
    setCookies(TOKEN_COOKIE, token, {
      sameSite: 'strict',
      req,
      res,
    })
    return {
      props: {
        secret,
        token,
        user,
      },
    }
  }
)

const VerifyEmailPage = ({ secret }) => {
  const { fetch, user } = useSite()
  const { addAlert } = useAlerts()
  const { t } = useTranslation()
  const [verified, setVerified] = useState(user.passwordCreated)
  const handleCreatePassword = createPassword(fetch, secret)
  const onSubmit = async (values) => {
    const res = await handleCreatePassword(values)
    setCookies(TOKEN_COOKIE, res.token, {
      sameSite: 'strict',
    })
    setVerified(res.user.passwordCreated)
    addAlert({
      id: 'verification-finished',
      severity: 'success',
      text: t('verification-finished'),
    })
  }
  return (
    <GenericPage>
      <MetaPage
        noRobots
        title={t('verification-title')}
        description={t('verification-general-description')}
      />
      <Container>
        <Row>
          <Col lg={{ offset: 3, span: 6 }}>
            <Collapse in={!verified}>
              <div>
                <Heading>{t('verification-title')}</Heading>
                <hr />
                <div>
                  <p>{t('verification-success')}</p>
                  <CreatePasswordForm onSubmit={onSubmit} />
                </div>
              </div>
            </Collapse>
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(VerifyEmailPage)
