import React, { useContext, useRef } from 'react'

export type IValueMap = Record<string, any>

export const MobXProviderContext = React.createContext<IValueMap | null>(Object.create(null))

export interface ProviderProps extends IValueMap {
  children?: React.ReactNode
}

export function Provider(props: ProviderProps): React.ReactElement {
  const { children, ...store } = props
  const parentValue = useContext(MobXProviderContext)
  const mutableProviderRef = useRef({ ...parentValue, ...store })
  const value = mutableProviderRef.current
  return <MobXProviderContext.Provider value={value}>{children}</MobXProviderContext.Provider>
}