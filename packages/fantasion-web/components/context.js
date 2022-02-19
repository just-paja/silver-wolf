import { createContext, useContext } from 'react'

export const HeadingLevelContext = createContext(0)
export const UserContext = createContext(null)

export const useHeadingLevel = () => useContext(HeadingLevelContext)
export const useUser = () => useContext(UserContext)
