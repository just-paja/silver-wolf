import { createStaticArticlePageGetter } from '../server/articles'
import { StaticArticlePage } from '../components/articles'

export const getServerSideProps = createStaticArticlePageGetter('about-us')

export default StaticArticlePage
