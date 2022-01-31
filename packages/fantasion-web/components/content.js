import classnames from 'classnames'
import Markdown from 'react-markdown'

import styles from './content.module.scss'

export const MarkdownContent = ({ children, ...props }) => (
  <Markdown {...props} className={classnames(props.className, styles.markdown)}>
    {children}
  </Markdown>
)
