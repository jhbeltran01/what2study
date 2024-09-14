import emailIcon from '@assets/email.png';
import googleIcon from '@assets/google.png'; // Import the Google icon
import passwordIcon from '@assets/password.png';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Utility functions for validation
const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const Signup = ({ onToggle, onAuthSuccess}) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset errors
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
        
        let isValid = true;

        // Validation checks
        if (!validateUsername(username)) {
            setUsernameError(' must be 3-20 characters long and contain only letters and numbers.');
            isValid = false;
        }

        if (!validateEmail(email)) {
            setEmailError(' must be in a valid format');
            isValid = false;
        }

        if (!validatePassword(password)) {
            setPasswordError(' must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
            isValid = false;
        }

        if (!isValid) return;

        try {
            await axios.post('http://localhost:8000/signup/', {
                username,
                email,
                password
            });
            onAuthSuccess();
            // Redirect to homepage or handle successful signup
            window.location.href = '/homepage'; // Replace with your homepage route
        } catch (error) {
            setError('An error occurred while creating the account.');
            console.error(error);
        }

        onAuthSuccess();
    };

    const handleGoogleSignup = () => {
        // Handle Google signup logic
        console.log('Google signup clicked');
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
                            <img src={emailIcon} alt="Email Icon" />
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
                            <img src={passwordIcon} alt="Password Icon" />
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
                <div className="signup-google" onClick={handleGoogleSignup}>
                    <img src={googleIcon} alt="Google Icon" className="google-icon" />
                    <span>Sign up with Google</span>
                </div>
                <div className="toggle-text">
                    <span className="text">Already have an account? </span>
                    <span className="link" onClick={onToggle}>Login here</span>
                </div>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

// Define the prop types
Signup.propTypes = {
    onToggle: PropTypes.func.isRequired,  // Validate that onToggle is a function and required
    onAuthSuccess: PropTypes.func.isRequired,  // Validate that onAuthSuccess is a function and required

};

export default Signup;
