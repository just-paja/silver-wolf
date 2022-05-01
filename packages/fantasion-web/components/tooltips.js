import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import styles from './tooltips.module.scss'

export const TextTooltip = ({ children, placement = 'auto-end', tip }) =>
  tip ? (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id={`tooltip-${tip}`}>{tip}</Tooltip>}
    >
      <span className={styles.tooltip}>{children}</span>
    </OverlayTrigger>
  ) : (
    children
  )
