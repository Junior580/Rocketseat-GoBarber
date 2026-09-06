import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './pages/App/App'

import { RouterProvider } from 'react-router-dom'
import AppProvider from './hooks/index'
import GlobalStyle from '../src/styles/global'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
    <GlobalStyle />
  </React.StrictMode>,
)
