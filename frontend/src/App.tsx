import { Route, Routes } from 'react-router-dom'
import { Signup } from './components/pages/UserSignup'
import { Signin } from './components/pages/UserSignin'
import { AdminSignin } from './components/pages/AdminSignin'
import { AdminSignup } from './components/pages/AdminSignup'
import { Home } from './components/pages/Home'
import { AuthOptions } from './components/pages/auth'
import { AdminProducts } from './components/pages/AdminProducts'
import { AdminProfile } from './components/pages/AdminProfile'
import { ProductGridCard } from './components/molecules/ProductGridCard'
import { AdminAddProduct } from './components/pages/AdminAddProduct'


function App() {

  return (
    <Routes>
      <Route path="/authoptions" element={<AuthOptions />} />
      <Route path="/user/signin" element={<Signin />} />
      <Route path="/user/signup" element={<Signup />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/signin" element={<AdminSignin />} />
      <Route path="/welcome" element={<Home />} />
      <Route path="/admin/myProducts" element={<AdminProducts />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/add-product" element={<AdminAddProduct />} />
      <Route path="/products" element={<ProductGridCard/>}/>
    </Routes>
  )
}

export default App
