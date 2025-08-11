import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import Logo from "../assets/Lab-logo.png";
import "./Navbar.css"

const Navbar = () => {
    const navigate= useNavigate();
  return (
    <div className='Navbar-container'>
        <div className="nav-container">
            <div className="Navbar-logo-container">
            <img src={Logo} className='Navbar-logo' />
        </div>
        <div className="Navbar-links-container">
            <NavLink className="nav-link" to="/">Accueil</NavLink>
            <NavLink className="nav-link" to="/apropos">A propos</NavLink>
            <NavLink className="nav-link" to="/contacts" >Contacts</NavLink>
        </div>
        <div className="Auth-btns-container">
            <div className="Login-btn">
                <button className="Login" >
                    Se connecter
                </button>
            </div>
            <div className="Signup-btn">
                <button className="Signup" >
                    S'inscrire
                </button>
            </div>

        </div>
        </div>
    </div>
  )
}

export default Navbar
