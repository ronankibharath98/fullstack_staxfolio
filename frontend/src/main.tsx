import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Navbar } from './components/organisms/Navbar.tsx'
import { PersistGate } from "redux-persist/integration/react"
import { Provider } from 'react-redux'
import { store, persistor } from "./redux/store.ts"
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Navbar/>
        <App />
      </BrowserRouter>
      </PersistGate>
    </Provider>
    
  </React.StrictMode>
)
