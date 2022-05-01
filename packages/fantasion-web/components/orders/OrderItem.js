import { DateRange } from '../dates'
import { IconBubble, SignupIcon } from '../icons'
import { Link } from '../links'
import { slug } from '../slugs'
import { UserName, getFullName } from '../users'
import { useTranslation } from 'next-i18next'

const PRODUCT_SIGNUP = 'fantasion_signups.Signup'
const PRODUCT_PROMOTION_CODE = 'fantasion_eshop.OrderPromotionCode'

export const OrderItemIcon = ({ item }) => {
  if (item.productType === PRODUCT_SIGNUP) {
    return (
      <Link route="signupDetail" params={{ signupId: item.id }}>
        <IconBubble title={getFullName(item.participant)}>
          <SignupIcon />
        </IconBubble>
      </Link>
    )
  }
  return null
}

export const OrderItemIcons = ({ items }) =>
  items.map((item) => <OrderItemIcon item={item} key={item.id} />)

const OrderItemPromotionCode = () => useTranslation().t('order-promotion-code')

const OrderItemSignup = ({ signup }) => (
  <>
    <Link
      route="participantDetail"
      params={{ participantId: signup.participant.id }}
    >
      <UserName user={signup.participant} />
    </Link>
    <div className="text-muted">
      <Link
        route="expeditionBatchDetail"
        params={{
          expeditionBatchSlug: slug(
            signup.troop.batch.id,
            signup.troop.batch.expedition.title
          ),
        }}
      >
        {signup.troop.batch.expedition.title}{' '}
        <DateRange start={signup.troop.startsAt} end={signup.troop.endsAt} />
      </Link>{' '}
      ({signup.troop.ageGroup.title})
    </div>
  </>
)

export const OrderItemDescription = ({ item }) => {
  if (item.productType === PRODUCT_SIGNUP) {
    return <OrderItemSignup signup={item} />
  }
  if (item.productType === PRODUCT_PROMOTION_CODE) {
    return <OrderItemPromotionCode code={item} />
  }
  return item.description
}
