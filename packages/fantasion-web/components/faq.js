import Markdown from 'react-markdown'

import { ControlledForm, Input } from './forms'
import { FormProvider, useForm } from 'react-hook-form'
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

const includes = (str, query) => str.includes(query)

export const Faqs = ({ faqs }) => {
  const form = useForm()
  const q = form.watch('q')
  const filterByQuery = (query) => (item) =>
    !query ||
    includes(item.question, query) ||
    includes(item.shortAnswer, query) ||
    includes(item.detailedAnswer, query)
  return (
    <>
      <FormProvider {...form}>
        <FaqFilter />
      </FormProvider>
      <dl>
        {faqs.results.filter(filterByQuery(q)).map((faq) => (
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
