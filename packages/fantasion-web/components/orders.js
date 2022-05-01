import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'
import countryList from 'react-select-country-list'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'

import { Address, PostalCodeInput, StreetNumberInput } from './addresses'
import { AutosaveForm, Form, FormControls, Input, useValidator } from './forms'
import { CancelIcon } from './icons'
import { Heading, Section } from './media'
import { InteractiveButton } from './buttons'
import { Money } from './money'
import { OrderItemDescription } from './orders/OrderItem'
import { OrderStatus } from './orders/OrderStatus.js'
import { string } from 'yup'
import { useFetch, useUser } from './context'
import { useFormContext } from 'react-hook-form'
import { UserName } from './users'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  OrderMoneyRow,
  OrderPaymentRow,
  OrderPaymentControls,
} from './orders/OrderPayment'

const OrderItem = ({ item, onDelete }) => (
  <div className="d-flex">
    <ListGroup.Item className="d-flex flex-fill">
      <div className="flex-grow-1">
        <OrderItemDescription item={item} />
      </div>
      <div className="text-end">
        <Money amount={item.price} />
      </div>
    </ListGroup.Item>
    {onDelete && (
      <InteractiveButton
        icon={CancelIcon}
        onClick={() => onDelete(item)}
        variant="danger"
      />
    )}
  </div>
)

const OrderItems = ({ items, onDelete }) => (
  <ListGroup className="mt-2">
    {items.map((item) => (
      <OrderItem item={item} key={item.id} onDelete={onDelete} />
    ))}
  </ListGroup>
)

const OrderCancelDialog = ({ error, inProgress, onCancel, onHide, show }) => {
  const { t } = useTranslation()
  return (
    <Modal show={show} onHide={inProgress ? null : onHide}>
      <Modal.Header closeButton={!inProgress}>
        <Modal.Title>{t('order-cancel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('order-cancel-cannot-go-back')}</p>
        <p className="mt-2">{t('order-will-be-refunded')}</p>
        {error && (
          <div className="mt-3">
            <Alert variant="danger">{t('operation-failed')}</Alert>
          </div>
        )}
        <div className="mt-3">
          <InteractiveButton
            inProgress={inProgress}
            onClick={onCancel}
            variant="danger"
          >
            {t('order-cancel')}
          </InteractiveButton>
        </div>
      </Modal.Body>
    </Modal>
  )
}

const OrderCancel = ({ order, onCancel }) => {
  const { t } = useTranslation()
  const [inProgress, setInProgress] = useState(false)
  const [error, setError] = useState(null)
  const [show, setShow] = useState(false)
  const fetch = useFetch()

  const handleCancel = async () => {
    setError(null)
    setInProgress(true)
    try {
      onCancel(await fetch.put(`/orders/${order.id}/cancel`))
      setShow(false)
    } catch (e) {
      setError(e)
    } finally {
      setInProgress(false)
    }
  }

  return (
    order.isCancellable && (
      <>
        <OrderCancelDialog
          error={error}
          inProgress={inProgress}
          onCancel={handleCancel}
          onHide={() => setShow(false)}
          order={order}
          show={show}
        />
        <InteractiveButton
          icon={CancelIcon}
          onClick={() => setShow(true)}
          title={t('order-cancel')}
          variant="link"
        />
      </>
    )
  )
}

export const OrderCard = ({
  order,
  hideStatus,
  onCancel,
  onItemDelete,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <Section component="article" {...props}>
      {!hideStatus && (
        <header className="d-flex align-items-start justify-content-between">
          <Heading>{order.variableSymbol}</Heading>
          {order.isCancellable && (
            <OrderCancel order={order} onCancel={onCancel} />
          )}
        </header>
      )}
      <OrderItems items={order?.items || []} onDelete={onItemDelete} />
      <Row className="flex-column-reverse flex-md-row">
        <Col md={hideStatus ? 12 : 6} className="mt-1">
          <div className="d-flex flex-row-reverse flex-md-row justify-content-center justify-content-md-start">
            <OrderPaymentControls order={order} />
          </div>
        </Col>
        <Col md={hideStatus ? 12 : 6} className="d-flex mt-2">
          <div className="ms-auto me-3">
            {order.useDepositPayment && (
              <>
                <OrderMoneyRow
                  label={t('order-deposit')}
                  amount={order.deposit}
                />
                <OrderMoneyRow
                  label={t('order-surcharge')}
                  amount={order.price - order.deposit}
                />
              </>
            )}
            <OrderMoneyRow label={t('order-total')} amount={order.price} />
            {!hideStatus && (
              <OrderPaymentRow
                label={t('order-status')}
                value={<OrderStatus status={order.status} />}
              />
            )}
          </div>
        </Col>
      </Row>
    </Section>
  )
}

export const PromotionCodeForm = ({ order, onSubmit }) => {
  const fetch = useFetch()
  const { t } = useTranslation()
  const handleSubmit = async (body) => {
    onSubmit(
      await fetch.post(`/orders/${order.id}/promotion-codes`, {
        body,
      })
    )
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="code"
        type="text"
        label={t('order-promotion-code')}
        required
      />
      <FormControls submitLabel={t('order-add-promotion-code')} />
    </Form>
  )
}

const AddressForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const defaultValues = {
    title: t('user-address-title-home'),
    countryCode: 'CZ',
  }
  const validator = useValidator({
    title: string().nullable().required(t('form-input-required')),
    street: string().nullable().required(t('form-input-required')),
    countryCode: string().nullable().required(t('form-input-required')),
    city: string().nullable().required(t('form-input-required')),
  })
  const countries = countryList().getData()
  return (
    <Form
      id="address"
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      resolver={validator}
    >
      <Input name="title" label={t('address-title')} required />
      <Row>
        <Col sm="auto">
          <Input name="street" label={t('address-street')} required />
        </Col>
        <Col sm="auto">
          <StreetNumberInput
            name="street_number"
            label={t('address-street-number')}
            required
          />
        </Col>
      </Row>
      <Row>
        <Input
          name="countryCode"
          type="select"
          options={countries}
          label={t('address-country')}
          required
        />
        <Col sm="auto">
          <Input name="city" label={t('address-city')} required />
        </Col>
        <Col sm="auto">
          <PostalCodeInput
            name="postal_code"
            label={t('address-postal-code')}
            required
          />
        </Col>
      </Row>
      <FormControls submitLabel={t('address-save')} />
    </Form>
  )
}

const AddAddressDialog = ({ show, onHide, onSubmit }) => {
  const { t } = useTranslation()
  return (
    <Modal show={show}>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>{t('address-add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddressForm onSubmit={onSubmit} />
      </Modal.Body>
    </Modal>
  )
}

export const BillingInformationPreview = ({ order }) => {
  const { t } = useTranslation()
  const user = useUser()
  return (
    <Section className="mt-3">
      <Heading>{t('order-billing-information')}</Heading>
      <p>
        <UserName user={user} />{' '}
      </p>
      <Address {...order.userInvoiceAddress} />
      <Heading className="mt-3">{t('order-payment-information')}</Heading>
      <p>{t('order-pay-via-bank-transfer-only')}</p>
    </Section>
  )
}

export const BillingInformation = ({
  addresses,
  onAddAddress,
  onSubmit,
  order,
}) => {
  const [showDialog, setShowDialog] = useState(false)
  const { t } = useTranslation()
  const fetch = useFetch()
  const defaultValues = {
    addressId: String(order.userInvoiceAddressId) || addresses[0]?.id,
  }
  const selectAddress = async (values) =>
    onSubmit(
      await fetch.patch(`/orders/${order.id}`, {
        body: {
          userInvoiceAddressId: parseInt(values.addressId, 10),
        },
      })
    )
  const showAddAddressDialog = () => setShowDialog(true)
  const hideAddAddressDialog = () => setShowDialog(false)
  const createAddress = async (values) => {
    const addr = await fetch.post('/user-addresses', {
      body: values,
    })
    await fetch.patch(`/orders/${order.id}`, {
      userInvoiceAddressId: addr.id,
    })
    onAddAddress(addr)
    hideAddAddressDialog()
  }

  return (
    <Section className="mt-3">
      <Heading>{t('order-billing-information')}</Heading>
      <AddAddressDialog
        show={showDialog}
        onHide={hideAddAddressDialog}
        onSubmit={createAddress}
      />
      <AutosaveForm defaultValues={defaultValues} onSubmit={selectAddress}>
        {addresses.results.map((address) => (
          <Input
            type="radio"
            name="addressId"
            key={address.id}
            label={<Address {...address} />}
            value={String(address.id)}
          />
        ))}
        <InteractiveButton variant="link" onClick={showAddAddressDialog}>
          {t('address-add')}
        </InteractiveButton>
      </AutosaveForm>
    </Section>
  )
}

const DepositSplitInput = () => {
  const { t } = useTranslation()
  const { watch } = useFormContext()
  const split = watch('useDepositPayment')
  return (
    <Input
      helpText={t(
        split ? 'order-deposit-help-text' : 'order-full-payment-help-text'
      )}
      label={t('order-use-deposit-payment')}
      name="useDepositPayment"
      type="checkbox"
    />
  )
}

export const PaymentInformation = ({ order, onSubmit }) => {
  const { t } = useTranslation()
  const fetch = useFetch()
  const defaultValues = {
    useDepositPayment: order.useDepositPayment,
  }
  const selectPaymentMethod = async (values) => {
    onSubmit(
      await fetch.patch(`/orders/${order.id}`, {
        body: {
          useDepositPayment: values.useDepositPayment,
        },
      })
    )
  }
  return (
    <Section className="mt-3">
      <Heading>{t('order-payment-information')}</Heading>
      <AutosaveForm
        defaultValues={defaultValues}
        onSubmit={selectPaymentMethod}
      >
        <p>{t('order-pay-via-bank-transfer-only')}</p>

        <DepositSplitInput />
      </AutosaveForm>
    </Section>
  )
}

export const EmptyBasket = ({ ...props }) => (
  <Alert {...props}>{useTranslation().t('order-basket-empty')}</Alert>
)
