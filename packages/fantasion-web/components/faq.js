import Markdown from 'react-markdown'

import { ControlledForm, Input } from './forms'
import { FormProvider, useForm } from 'react-hook-form'
import { Heading } from './media'
import { Index } from 'flexsearch'
import { reverse } from '../routes'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const Faq = ({ question, detailedAnswer, shortAnswer }) => {
  return (
    <>
      <dt>
        <Markdown>{question}</Markdown>
      </dt>
      <dd>
        <div className="lead">
          <Markdown>{shortAnswer}</Markdown>
        </div>
        <Markdown>{detailedAnswer}</Markdown>
      </dd>
    </>
  )
}

const FaqFilter = () => {
  const { t } = useTranslation()
  return (
    <ControlledForm>
      <Input
        autoFocus
        name="q"
        label={t('faq-quick-search')}
        placeholder={t('faq-quick-search-placeholder')}
      />
    </ControlledForm>
  )
}

const createIndex = (language, faqs) => {
  const index = new Index({
    charset: 'latin:extra',
    language,
  })
  for (const faq of faqs) {
    index.add(
      faq.id,
      `${faq.question} ${faq.shortAnswer} ${faq.detailedAnswer}`
    )
  }
  return index
}

const sortByMatch = (matchIds) => (a, b) =>
  matchIds ? matchIds.indexOf(a.id) - matchIds.indexOf(b.id) : 0

export const Faqs = ({ faqs }) => {
  const { i18n, t } = useTranslation()
  const { query, push } = useRouter()
  const lang = i18n.language
  const decodedQuery = query.q ? decodeURIComponent(query.q) : ''
  const form = useForm({ defaultValues: { q: decodedQuery } })
  const q = form.watch('q')
  const index = useMemo(
    () => createIndex(lang, faqs.results),
    [lang, faqs.results]
  )
  const matchIds = q ? index.search(q) : null
  useEffect(() => {
    if (q && q !== decodedQuery) {
      const encoded = encodeURIComponent(q)
      const target = `${reverse(lang, 'faq')}?q=${encoded}`
      const rewrite = `/faq?q=${encoded}`
      push(rewrite, target)
    }
  }, [q, lang, decodedQuery, push])
  return (
    <>
      <Heading>{t('faq-title')}</Heading>
      <FormProvider {...form}>
        <FaqFilter />
      </FormProvider>
      <dl className="mt-3">
        {faqs.results
          .filter((faq) => !matchIds || matchIds.includes(faq.id))
          .sort(sortByMatch(matchIds))
          .map((faq) => (
            <Faq
              question={faq.question}
              shortAnswer={faq.shortAnswer}
              key={faq.id}
            />
          ))}
      </dl>
    </>
  )
}
