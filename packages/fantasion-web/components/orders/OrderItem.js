import { IconBubble, SignupIcon } from '../icons'
import { Link } from '../links'
import { UserName } from '../users'
import { useTranslation } from 'next-i18next'

const PRODUCT_SIGNUP = 'fantasion_signups.Signup'
const PRODUCT_PROMOTION_CODE = 'fantasion_eshop.OrderPromotionCode'

export const OrderItemIcon = ({ item }) => {
  if (item.productType === PRODUCT_SIGNUP) {
    return (
      <Link route="signupDetail" params={{ signupId: item.id }}>
        <IconBubble>
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
    <UserName user={signup.participant} />
    <div className="text-muted">
      {signup.troop.batch.expedition.title}: {signup.troop.ageGroup.title}
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
