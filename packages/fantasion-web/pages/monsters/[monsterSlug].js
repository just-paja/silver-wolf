import React from 'react'

import { asPage, MetaPage } from '../../components/meta'
import { GenericPage } from '../../components/layout'
import { withPageProps } from '../../server/props'
import { parseSlug } from '../../components/slugs'
import { MonsterDetail } from '../../components/monsters'

export const getServerSideProps = withPageProps(async ({ fetch, params }) => {
  const monsterId = parseSlug(params.monsterSlug)
  const monster = await fetch(`/monsters/${monsterId}`)
  return {
    props: {
      monsterId,
      monster,
    },
  }
})

const MonsterPage = ({ monster }) => (
  <GenericPage>
    <MetaPage title={monster.title} description={monster.description} />
    <MonsterDetail monster={monster} />
  </GenericPage>
)

export default asPage(MonsterPage)
