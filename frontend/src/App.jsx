import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import LoginForm from './components/LoginForm'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginForm/>} />
          <Route path='/dashboard' element={<Dashboard/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
