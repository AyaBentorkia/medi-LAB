import React from 'react'
import Navbar from '../../components/Navbar'
import WelcomePart from '../../components/WelcomePart'
import  About  from "./About";
import "./Home.css"
import Contact from './Contact';
import Footer from '../../components/Footer';

const Home = () => {
  return (
    <>
    <Navbar /> 
    <WelcomePart />
    <About />     
    <Contact />
    <Footer />
    </>
  )
}

export default Home
