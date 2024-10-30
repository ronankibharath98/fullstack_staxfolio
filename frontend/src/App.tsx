import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Signup } from './pages/user/Signup'
import { Signin } from './pages/user/Signin'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/signup" element= {<Signup/>}/>
      <Route path="/signin" element= {<Signin/>}/>
      <Route path="admin/signup" element= {<Signup/>}/>
      <Route path="admin/signin" element= {<AdminSignin/>}/>
    </Routes>
    </BrowserRouter>
  )
}
import { AdminSignin } from './pages/admin/AdminSignin'

export default App
