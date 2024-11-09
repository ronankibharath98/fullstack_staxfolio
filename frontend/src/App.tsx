import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/user/Signup'
import { Signin } from './pages/user/Signin'
import { AdminSignin } from './pages/admin/AdminSignin'
import { AdminSignup } from './pages/admin/AdminSignup'
import { AdminHome } from './pages/admin/AdminHome'
import { AuthOptions } from './pages/auth'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authoptions" element = {<AuthOptions/>}/>
        <Route path="/signup" element= {<Signup/>}/>
        <Route path="/signin" element= {<Signin/>}/>
        <Route path="/admin/signup" element= {<AdminSignup/>}/>
        <Route path="/admin/signin" element= {<AdminSignin/>}/>
        <Route path="/admin/welcome" element= {<AdminHome/>}/>
        <Route path="/welcome" element= {<AdminHome/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
