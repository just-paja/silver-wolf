import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import React from 'react'

import { NavLink } from '../links'
import { Main } from '../media'
import { useTranslation } from 'next-i18next'

const ProfileNav = () => {
  const { t } = useTranslation()
  return (
    <Nav className="flex-md-column" variant="pills">
      <NavLink route="status">{t('my-status')}</NavLink>
      <NavLink route="participants">{t('family-participants')}</NavLink>
      <NavLink route="circleLog">{t('circle-log')}</NavLink>
    </Nav>
  )
}

export const ProfileLayout = ({ children }) => (
  <Container>
    <Row>
      <Col md={4} lg={3} xl={2}>
        <ProfileNav />
      </Col>
      <Col md={8} lg={9} xl={10}>
        <Main className="mt-3">{children}</Main>
      </Col>
    </Row>
  </Container>
)
