import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Navbar } from './components/shared/Navbar.tsx'
import { Provider } from 'react-redux'
import { store } from "./redux/store.ts"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Navbar/>
      <App />
    </Provider>
    
  </StrictMode>,
)
