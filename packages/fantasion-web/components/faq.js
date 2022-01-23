import Markdown from 'react-markdown'

import { ControlledForm, Input } from './forms'
import { FormProvider, useForm } from 'react-hook-form'
import { Index } from 'flexsearch'
import { useMemo } from 'react'
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
      <Input label={t('Search')} name="q" />
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
  const { i18n } = useTranslation()
  const form = useForm()
  const q = form.watch('q')
  const index = useMemo(
    () => createIndex(i18n.language, faqs.results),
    [i18n, faqs.results]
  )
  const matchIds = q ? index.search(q) : null
  return (
    <>
      <FormProvider {...form}>
        <FaqFilter />
      </FormProvider>
      <dl>
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
