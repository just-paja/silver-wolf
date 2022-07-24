import React from 'react'

import { AddressLine, joinAddressValue } from './addresses'
import { IconLabel, LocationPinIcon } from './icons'

export const LocationAddress = ({ location, title }) => (
  <address>
    <AddressLine value={title} />
    <AddressLine value={location.name} />
    <AddressLine value={[location.street, location.streetNumber]} />
    <AddressLine value={[location.city, location.postalCode]} />
    <AddressLine value={location.country?.name} />
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

export const LocationFuzzyName = ({ location }) => (
  <IconLabel
    icon={LocationPinIcon}
    text={location.fuzzyName || location.name}
  />
)
