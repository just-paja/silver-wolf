import { createStaticArticlePageGetter } from '../server/articles'
import { StaticArticlePage } from '../components/articles'

export const getServerSideProps = createStaticArticlePageGetter('codex')

export default StaticArticlePage
