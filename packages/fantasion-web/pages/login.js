import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { Link } from '../components/links'
import { LoginForm } from '../components/login'
import { setCookies } from 'cookies-next'
import { TOKEN_COOKIE } from '../api'
import { reverse } from '../routes'
import { useRouter } from 'next/router'
import { useSite } from '../components/context'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

export const getServerSideProps = withPageProps()

const LoginPage = () => {
  const { t } = useTranslation()
  const { lang, fetch } = useSite()
  const router = useRouter()
  const handleLogin = async (values) => {
    const { token } = await fetch.post('/users/get-token', {
      body: values,
    })
    setCookies(TOKEN_COOKIE, token, {
      sameSite: 'strict',
    })
    const redirectTo =
      localStorage.getItem('redirectTo') || reverse(lang, 'home')
    router.push(redirectTo)
    localStorage.removeItem('redirectTo')
  }
  return (
    <GenericPage>
      <MetaPage
        title={t('login-title')}
        description={t('login-general-description')}
      />
      <Container>
        <Heading>{t('login-title')}</Heading>
        <hr className="mb-0" />
        <Row>
          <Col md={6} lg={5} xl={4} className="mt-4">
            <Heading relativeLevel={2}>{t('login-with-email')}</Heading>
            <LoginForm onSubmit={handleLogin} />
          </Col>
          <Col md={6} lg={5} xl={4} className="mt-4">
            <Heading relativeLevel={2}>{t('login-register')}</Heading>
            <p>{t('login-register-general-info')}</p>
            <div className="mt-2">
              <Link as={Button} route="register">
                {t('login-create-account')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(LoginPage)
