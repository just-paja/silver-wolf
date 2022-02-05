import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React from 'react'
import Row from 'react-bootstrap/Row'

import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { getPageProps } from '../server/props'
import { Heading } from '../components/media'
import { Link } from '../components/links'
import { LoginForm } from '../components/login'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = async (props) => {
  return {
    props: {
      ...(await getPageProps(props)).props,
    },
  }
}

const LoginPage = () => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('login-title')}
        description={t('login-general-description')}
      />
      <Container>
        <Heading>{t('login-title')}</Heading>
        <hr />
        <Row>
          <Col md={6} lg={5} xl={4}>
            <Heading relativeLevel={2}>{t('login-with-email')}</Heading>
            <LoginForm />
          </Col>
          <Col md={6} lg={5} xl={4}>
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
