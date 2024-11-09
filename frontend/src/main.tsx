import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Navbar } from './components/shared/Navbar.tsx'
import { PersistGate } from "redux-persist/integration/react"
import { Provider } from 'react-redux'
import { store, persistor } from "./redux/store.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <Navbar/>
      <App />
      </PersistGate>
    </Provider>
    
  </StrictMode>,
)
