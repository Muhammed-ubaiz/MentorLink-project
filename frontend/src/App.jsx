import { useState } from 'react'
import './App.css'
import AdminLogin from './components/AdminPage/AdminLogin'
import AdminDashbord from './components/AdminPage/AdminDashbord'
import LayoutRoutes from './Routes/LayoutRoutes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    {/* <AdminLogin/>
    <AdminDashbord/> */}
    <LayoutRoutes/>
    </>
  )
}

export default App
