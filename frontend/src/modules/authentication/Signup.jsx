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

Ticket Information: [STUD-001] Signup Page UI
Purpose: Allows users to create StudyHive accounts by providing their emails, usernames, and passwords.
***********************************************************************************************************************************/
import googleIcon from '@assets/google.png';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Utility functions for validation
const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const Signup = ({ onToggle, onAuthSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Reset errors
        setUsernameError('');
        setEmailError('');
        setPasswordError('');

        let isValid = true;

        // Validation checks
        if (!validateUsername(username)) {
            setUsernameError('Oh no, username must be 3-20 characters long and contain only letters and numbers.');
            isValid = false;
        }
        if (!validateEmail(email)) {
            setEmailError('Oh no, email must be in a valid format.');
            isValid = false;
        }
        if (!validatePassword(password)) {
            setPasswordError('Oh no, password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            isValid = false;
        }

        if (!isValid) return;

        // Save signup data to localStorage
        localStorage.setItem('user', JSON.stringify({
            username,
            email,
            password,
        }));

        alert('Signup successful!');
        onAuthSuccess(); // Call the success handler
    };

    return (
        <div className="signup-container">
            <div className="greeting">Create an Account</div>
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="input">
                        <label>
                            Username
                            {usernameError && <span className="error">{usernameError}</span>}
                        </label>
                        <div className={`input-field ${usernameError ? 'error-border' : ''}`}>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="input">
                        <label>
                            Email
                            {emailError && <span className="error">{emailError}</span>}
                        </label>
                        <div className={`input-field ${emailError ? 'error-border' : ''}`}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">
                        Sign Up
                    </button>
                </div>
                <hr className="divider" />
                <div className="signup-google" onClick={() => console.log('Google signup clicked')}>
                    <img src={googleIcon} alt="Google Icon" className="google-icon" />
                    <span>Sign up with Google</span>
                </div>
                <div className="toggle-text">
                    <span className="text">Already have an account? </span>
                    <span className="link" onClick={onToggle}>Login here</span>
                </div>
            </form>
        </div>
    );
};

Signup.propTypes = {
    onToggle: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func.isRequired,
};

export default Signup;
