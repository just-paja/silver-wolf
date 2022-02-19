import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { apiFetch } from '../api'
import { asPage, MetaPage } from '../components/meta'
import { GenericPage } from '../components/layout'
import { Heading } from '../components/media'
import { Link } from '../components/links'
import { RegisterForm, RegisterFormSuccess } from '../components/register'
import { useTranslation } from 'next-i18next'
import { withPageProps } from '../server/props'

export const getServerSideProps = withPageProps()

const RegisterPageContent = ({ onSubmit }) => {
  const { t } = useTranslation()
  return (
    <Row>
      <Col md={6} lg={5} xl={4}>
        <Heading relativeLevel={2}>{t('register-with-email')}</Heading>
        <RegisterForm onSubmit={onSubmit} />
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
  )
}

const RegisterPage = () => {
  const { t } = useTranslation()
  const [user, setUser] = useState(null)
  const onSubmit = async (values) => {
    setUser(
      await apiFetch('/users/register', {
        body: JSON.stringify(values),
        method: 'POST',
      })
    )
  }
  return (
    <GenericPage>
      <MetaPage
        title={t('register-title')}
        description={t('register-general-description')}
      />
      <Container>
        <Heading>{t('register-title')}</Heading>
        <hr />
        {user ? (
          <RegisterFormSuccess />
        ) : (
          <RegisterPageContent onSubmit={onSubmit} />
        )}
      </Container>
    </GenericPage>
  )
}

export default asPage(RegisterPage)