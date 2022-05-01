import Badge from 'react-bootstrap/Badge'
import BsForm from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import classnames from 'classnames'
import Dropdown from 'react-bootstrap/Dropdown'
import Spinner from 'react-bootstrap/Spinner'

import { CancelIcon } from './icons'
import { FormLabel } from './forms'
import { TextTooltip } from './tooltips'
import { useCombobox } from 'downshift'
import { useFetch } from './context'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'next-i18next'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import styles from './search.module.scss'

const SearchElement = ({ children, show, ...props }) => (
  <Dropdown.Item
    className={classnames(styles.menuElement, { [styles.show]: show })}
    {...props}
  >
    {children}
  </Dropdown.Item>
)

const SearchEmpty = ({ query, show }) => (
  <SearchElement show={show}>
    {useTranslation().t('search-no-results-found', { query })}
  </SearchElement>
)

const SearchLoader = ({ show }) => (
  <SearchElement show={show}>
    <Spinner /> {useTranslation().t('search-loading')}
  </SearchElement>
)

const SelectBubble = ({ item, itemToString, onRemove }) => (
  <Badge className={styles.bubble}>
    <span className={styles.bubbleLabel}>
      <TextTooltip tip={item.description}>{itemToString(item)}</TextTooltip>
    </span>
    <Button onClick={() => onRemove(item)}>
      <CancelIcon />
    </Button>
  </Badge>
)

const ReflessWritableSelect = (
  { disabled, itemToString, label, onRemove, parentName, required, ...props },
  ref
) => {
  const { watch } = useFormContext()
  const value = watch(parentName)
  const values = Array.isArray(value) ? value : [value]
  const searchRef = useRef(null)
  useImperativeHandle(ref, () => searchRef.current)
  const focusInput = () => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }
  return (
    <BsForm.Group controlId={parentName}>
      <FormLabel text={label} required={required} />
      <div
        className={classnames('d-flex', 'form-control', styles.writable, {
          [styles.disabled]: disabled,
        })}
        onClick={focusInput}
      >
        {values.filter(Boolean).map((v) => (
          <SelectBubble
            item={v}
            key={itemToString(v)}
            itemToString={itemToString}
            onRemove={onRemove}
          />
        ))}
        <div className={styles.inputContainer}>
          <input
            disabled={disabled}
            size={props?.value?.length || 3}
            autoComplete="off"
            {...props}
            ref={searchRef}
          />
        </div>
      </div>
    </BsForm.Group>
  )
}

const WritableSelect = forwardRef(ReflessWritableSelect)

const getObjectIdent = (option) => option.id
const getObjectTitle = (option) => option.title
const createOption = (str) => ({
  id: str,
  title: str,
})

const TYPING_THROTTLE = 125

const ReflessSearchInput = (
  {
    allowNew,
    collection,
    itemToString = getObjectTitle,
    optionToString = getObjectTitle,
    optionToIdent = getObjectIdent,
    multiple,
    name,
    stringToOption = createOption,
    ...props
  },
  ref
) => {
  const { watch, setValue } = useFormContext()
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const fetch = useFetch()
  const equals = (a, b) => itemToString(a) === itemToString(b)
  const optionEquals = (a, b) => optionToString(a) === optionToString(b)
  const searchTimeout = useRef(null)
  const mounted = useRef(true)
  const queryBackend = async ({ inputValue }) => {
    try {
      const data = await fetch(`/${collection}?q=${inputValue}`)
      const nextOptions = allowNew
        ? [...data.results, stringToOption(inputValue)].filter(
            (item, index, src) =>
              src.findIndex((i) => optionEquals(i, item)) === index
          )
        : data.results
      if (mounted.current) {
        setOptions(nextOptions)
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(
    () => () => {
      mounted.current = false
      clearTimeout(searchTimeout.current)
    },
    []
  )
  const handleSearch = async ({ inputValue }) => {
    setLoading(true)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(
      () => queryBackend({ inputValue }),
      TYPING_THROTTLE
    )
  }
  const value = watch(name)
  const handleRemove = (item) => {
    setValue(name, multiple ? (value || []).filter((i) => i !== item) : null)
  }
  const handleRemoveLast = (e) => {
    if (e.key === 'Backspace' && !e.target.value) {
      const src = value || []
      handleRemove(src[src.length - 1])
    }
  }
  const {
    getComboboxProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
  } = useCombobox({
    defaultHighlightedIndex: 0,
    items: options,
    itemToString,
    onInputValueChange: handleSearch,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!multiple) {
        setValue(name, selectedItem)
      }
      if (!selectedItem) {
        return
      }
      const selectedItems = value || []
      const exists = selectedItems.some((item) => equals(item, selectedItem))
      if (!exists) {
        setValue(name, [...selectedItems, selectedItem])
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue: '',
          }
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: '',
          }
        default:
          return changes
      }
    },
    ref,
  })
  const inputProps = getInputProps({
    onKeyDown: handleRemoveLast,
  })
  return (
    <div {...getComboboxProps()}>
      <WritableSelect
        {...props}
        {...inputProps}
        itemToString={itemToString}
        parentName={name}
        name={`${name}-search`}
        onRemove={handleRemove}
      />
      <div {...getMenuProps()}>
        <Dropdown.Menu show={isOpen}>
          {options.map((item, index) => (
            <Dropdown.Item
              active={index === highlightedIndex}
              key={optionToIdent(item)}
              {...getItemProps({ item, index })}
            >
              {optionToString(item)}
            </Dropdown.Item>
          ))}
          {!allowNew && (
            <SearchEmpty query={inputProps.value} show={options.length === 0} />
          )}
          {<SearchLoader show={loading} />}
        </Dropdown.Menu>
      </div>
    </div>
  )
}

export const SearchInput = forwardRef(ReflessSearchInput)
