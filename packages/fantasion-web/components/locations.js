import React from 'react'

import { AddressLine, joinAddressValue } from './addresses'

export const LocationAddress = ({ location, title }) => (
  <address>
    {[
      title && <strong>{title}</strong>,
      title !== location.name && location.name,
      location.city,
      [location.street, location.streetNumber],
      [location.postalCode, location.country?.name],
    ]
      .filter(Boolean)
      .map((value, index, src) => (
        <AddressLine key={value} value={value} br={index !== src.length - 1} />
      ))}
  </address>
)

export const LocationMap = ({ location }) => {
  const key = 'AIzaSyDZAOm63J4-B0hXyWW0dC9wr8gug5JEnN0'
  const query =
    location.lat && location.lng
      ? `${location.lat},${location.lng}`
      : encodeURIComponent(
          joinAddressValue(
            [
              location.country?.name,
              location.city,
              location.street,
              location.streetNumber,
              location.postalCode,
            ],
            ', '
          )
        )

  const src = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}`
  return <iframe src={src} />
}
