/***********************************************************************************************************************************
Subject: ITMC311 Integrative Programming 2
Mentor: Sir Kevin G. Vega
App Name: StudyHive
Company Name: BCDP

Company Members:
Nicole B. Castillo
Marie Angeline Pelausa
Joy Milangela Dacuba
Harold Beltran
___________________________________________________________________________________________________________________________________

Ticket Information: [STUD-004] Login Page UI
Purpose: Allows users to log into their StudyHive accounts by providing their usernames and passwords.
***********************************************************************************************************************************/
import googleIcon from '@assets/google.png';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

const validateUsernameOrEmail = (usernameOrEmail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail) || usernameOrEmail.trim().length > 0;
const validatePassword = (password) => password.trim().length > 0;

const Login = ({ onToggle, onAuthSuccess }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameOrEmailError, setUsernameOrEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState(null);
    //const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Reset errors
        setUsernameOrEmailError('');
        setPasswordError('');
        setError(null);

        let isValid = true;

        // Validation checks
        if (!validateUsernameOrEmail(usernameOrEmail)) {
            setUsernameOrEmailError(' cannot be empty.');
            isValid = false;
        }
        if (!validatePassword(password)) {
            setPasswordError(' cannot be empty.');
            isValid = false;
        }

        if (!isValid) return;

        const savedUser = JSON.parse(localStorage.getItem('user'));

        // Check if user exists in local storage
        if (savedUser && (savedUser.username === usernameOrEmail || savedUser.email === usernameOrEmail) && savedUser.password === password) {
            onAuthSuccess(); // Call the success handler
            //navigate('/homepage'); // Navigate to the homepage upon successful login
        } else {
            setError('Invalid credentials.'); // Display error if credentials are invalid
        }
    };

    return (
        <div className="login-container">
            <div className="greeting">Welcome Back</div>
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="input">
                        <label>
                            Username
                            {usernameOrEmailError && <span className="error">{usernameOrEmailError}</span>}
                        </label>
                        <div className={`input-field ${usernameOrEmailError ? 'error-border' : ''}`}>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="input">
                        <label>
                            Password
                            {passwordError && <span className="error">{passwordError}</span>}
                        </label>
                        <div className={`input-field ${passwordError ? 'error-border' : ''}`}>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="forgot-password-container">
                    <div className="forgot-password" onClick={() => {/* Handle forgot password logic */}}>
                        Forgot Password?
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">
                        Login
                    </button>
                </div>
                <hr className="divider" />
                <div className="login-google" onClick={() => console.log('Google login clicked')}>
                    <img src={googleIcon} alt="Google Icon" className="google-icon" />
                    <span>Login with Google</span>
                </div>
                <div className="toggle-text">
                    <span className="text">Don&apos;t have an account? </span>
                    <span className="link" onClick={onToggle}>Sign Up here</span>
                </div>
            </form>
            {error && <p className="error-message">{error}</p>} {/* Display error message if credentials are invalid */}
        </div>
    );
};

Login.propTypes = {
    onToggle: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func.isRequired,
};

export default Login;
