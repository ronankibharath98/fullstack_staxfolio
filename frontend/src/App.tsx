import { Route, Routes, useLocation } from 'react-router-dom'
import { Signup } from './components/pages/UserSignup'
import { Signin } from './components/pages/UserSignin'
import { AdminSignin } from './components/pages/AdminSignin'
import { AdminSignup } from './components/pages/AdminSignup'
import { Home } from './components/pages/Home'
import { AuthOptions } from './components/pages/auth'
import { AdminProducts } from './components/pages/AdminProducts'
import { Profile } from './components/pages/Profile'
import { ProductGridCard } from './components/molecules/ProductGridCard'
import { AdminAddProduct } from './components/pages/AdminAddProduct'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { logout } from './redux/authSlice'


function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if(path.endsWith("/signup") || path.endsWith("/signin") || path.endsWith("/authoptions")){
      dispatch(logout());
    }
  }, [location, dispatch]);
  
  return (
    <Routes>
      <Route path="/authoptions" element={<AuthOptions />} />
      <Route path="/user/signin" element={<Signin />} />
      <Route path="/user/signup" element={<Signup />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/signin" element={<AdminSignin />} />
      <Route path="/welcome" element={<Home />} />
      <Route path="/admin/myProducts" element={<AdminProducts />} />
      <Route path="/admin/profile" element={<Profile />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/add-product" element={<AdminAddProduct />} />
      <Route path="/products" element={<ProductGridCard/>}/>
    </Routes>
  )
}

export default App
