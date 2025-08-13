import React from 'react';
import { NavLink } from 'react-router-dom'; // pour navigation interne
import './Register.css';

const Register = () => {
  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-title-wrapper">
          <h2>Créer un compte</h2>
        </div>

        <div className="register-form-wrapper">
          <form>
            <div className='register-form-wrapper'>
            <div className="register-side-container">
              <div className="form-group">
                <label htmlFor="firstname">Prénom</label>
                <input type="text" className="input-field" id="firstname" name="firstname" required />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Nom de famille</label>
                <input type="text" className="input-field" id="lastname" name="lastname" required />
              </div>

              <div className="form-group">
                <label htmlFor="cin">CIN</label>
                <input type="text" className="input-field" id="cin" name="cin" required />
              </div>

              <div className="form-group gender-group">
                <label>Genre</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="gender" value="Male" required /> Homme
                  </label>
                  <label>
                    <input type="radio" name="gender" value="Female" required /> Femme
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Numéro de téléphone</label>
                <input type="text" className="input-field" id="phoneNumber" name="phoneNumber" required />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rôle</label>
                <select className="role-select" id="role" name="role" required>
                  <option value="Patient">Patient</option>
                  <option value="Technicien de laboratoire">Technicien de laboratoire</option>
                  <option value="Secrétaire d'accueil">Secrétaire d'accueil</option>
                </select>
              </div>
            </div>

            <div className="register-side-container">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="input-field" id="email" name="email" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" className="input-field" id="password" name="password" required />
              </div>

              <div className="form-group">
                <label htmlFor="address">Adresse</label>
                <input type="text" className="input-field" id="address" name="address" required />
              </div>

              <div className="form-group">
                <label htmlFor="birthdate">Date de naissance</label>
                <input type="date" className="input-field" id="birthdate" name="birthdate" required />
              </div>

              <div className="form-group">
                <label htmlFor="city">Gouvernorat</label>
                <input type="text" className="input-field" id="city" name="city" required />
              </div>

              
            </div>
</div>
<div className='register-footer-wrapper'>
            <div className="register-btn-wrapper">
              <button className="register-btn" type="submit">S'inscrire</button>
            </div>

            <div className="register-footer">
              <p>Vous avez déjà un compte ? <NavLink to="/login">Se connecter</NavLink></p>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
