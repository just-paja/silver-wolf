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
import { RegisterForm } from '../components/register'
import { useTranslation } from 'next-i18next'

export const getServerSideProps = async (props) => {
  return {
    props: {
      ...(await getPageProps(props)).props,
    },
  }
}

const RegisterPage = () => {
  const { t } = useTranslation()
  return (
    <GenericPage>
      <MetaPage
        title={t('register-title')}
        description={t('register-general-description')}
      />
      <Container>
        <Heading>{t('register-title')}</Heading>
        <hr />
        <Row>
          <Col md={6} lg={5} xl={4}>
            <Heading relativeLevel={2}>{t('register-with-email')}</Heading>
            <RegisterForm />
          </Col>
          <Col md={6} lg={5} xl={4}>
            <Heading relativeLevel={2}>{t('register-have-account')}</Heading>
            <div className="mt-2">
              <Link as={Button} route="register">
                {t('register-login')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </GenericPage>
  )
}

export default asPage(RegisterPage)
