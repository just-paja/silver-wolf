import classnames from 'classnames'
import Markdown from 'react-markdown'

import { Heading } from './media'

import styles from './content.module.scss'

const transformHeading = ({ level, children, ...props }) => (
  <Heading {...props} relativeLevel={level}>
    {children}
  </Heading>
)

const componentMap = {
  h1: transformHeading,
  h2: transformHeading,
  h3: transformHeading,
  h4: transformHeading,
  h5: transformHeading,
}

export const MarkdownContent = ({ children, ...props }) => (
  <Markdown
    {...props}
    components={componentMap}
    className={classnames(props.className, styles.markdown)}
  >
    {children}
  </Markdown>
)
