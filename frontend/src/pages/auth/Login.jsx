import React from 'react'
import "./Login.css"
import { NavLink } from 'react-router'

const Login = () => {
  return (
    <>
    <div className="Login-container">
        <div className="login-wrapper">
        <div className="login-title-wrapper">
            <h2>Se connecter</h2>
            </div>
            <div className="login-form-wrapper">
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" className='input-field' id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" className='input-field' id="password" name="password" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select className='role-select' id="role" name="role" required>
                            {/* <option value="">Sélectionner un rôle</option> */}
                            <option value="Patient">Patient</option>
                            <option value="Technicien de laboratoire">Technicien de laboratoire</option>
                            <option value="Secrétaire d'accueil">Secrétaire d'accueil</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="login-btn-wrapper">
                        <button className='login-btn' type="submit">Se connecter</button>
                    </div>
                    
                    <div className="login-footer">
                        <p>Vous n'avez pas de compte ? <NavLink to="/register">S'inscrire</NavLink></p>
                    </div>
                </form>
            </div>
            </div>
        
    </div>
      
    </>
  )
}

export default Login
