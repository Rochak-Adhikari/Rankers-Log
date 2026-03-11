import { createContext, useContext, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

const AppModeContext = createContext({
  mode: 'social',
  isMessagingMode: false,
  isSocialMode: true
})

export function AppModeProvider({ children }) {
  const location = useLocation()
  
  const value = useMemo(() => {
    const isMessagingMode = location.pathname.startsWith('/messages')
    return {
      mode: isMessagingMode ? 'messaging' : 'social',
      isMessagingMode,
      isSocialMode: !isMessagingMode
    }
  }, [location.pathname])

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  )
}

export function useAppMode() {
  return useContext(AppModeContext)
}
