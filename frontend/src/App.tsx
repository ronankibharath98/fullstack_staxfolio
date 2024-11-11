import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/user/Signup'
import { Signin } from './pages/user/Signin'
import { AdminSignin } from './pages/admin/AdminSignin'
import { AdminSignup } from './pages/admin/AdminSignup'
import { AdminHome } from './pages/admin/AdminHome'
import { AuthOptions } from './pages/auth'
import { AdminProducts } from './pages/admin/AdminProducts'


function App() {

  return (
    <Routes>
      <Route path="/authoptions" element={<AuthOptions />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/provider/signup" element={<AdminSignup />} />
      <Route path="/provider/signin" element={<AdminSignin />} />
      <Route path="/provider/welcome" element={<AdminHome />} />
      <Route path="/provider/myProducts" element={<AdminProducts />} />
      <Route path="/welcome" element={<AdminHome />} />
    </Routes>
  )
}

export default App
