import { useState } from 'react'
import {Routes, Route} from "react-router-dom";
import Home from './pages/Home/Home';
import './App.css'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import About from './pages/Home/About';
import Contact from './pages/Home/Contact';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/about' element={<About />} />
      <Route path='/contact' element={<Contact />} />

    </Routes>
    </>
  )
}

export default App
