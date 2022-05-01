import { capitalize } from '../api'
import { useState } from 'react'

export const withEntity = (Component, entityName) =>
  function WithEntity(props) {
    const passProps = { ...props }
    const defaultValue = props[entityName]
    const [currentValue, setValue] = useState(defaultValue)
    const target = capitalize(entityName)
    passProps[entityName] = currentValue
    passProps[`set${target}`] = setValue
    return <Component {...passProps} />
  }

export const withEntityCollection = (Component, collectionName) =>
  function WithEntityCollection(props) {
    const passProps = { ...props }
    const defaultValue = props[collectionName]
    const [currentValue, setValue] = useState(defaultValue)
    const collection = capitalize(collectionName)
    const updateItem = (replacement) =>
      setValue({
        ...currentValue,
        results: currentValue.results.map((item) =>
          item.id === replacement.id ? replacement : item
        ),
      })
    passProps[collectionName] = currentValue
    passProps[`set${collection}`] = setValue
    passProps[`update${collection}Item`] = updateItem
    return <Component {...passProps} />
  }
