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

import googleIcon from '@assets/google.png'; // Import the Google icon
import passwordIcon from '@assets/password.png'; // Import the password icon
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
  
// Utility functions for validation
const validateUsernameOrEmail = (usernameOrEmail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail) || usernameOrEmail.trim().length > 0;
const validatePassword = (password) => password.trim().length > 0;
  
const Login = ({ onToggle, onAuthSuccess }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState(''); // State for username or email input
    const [password, setPassword] = useState(''); // State for password input
    const [usernameOrEmailError, setUsernameOrEmailError] = useState(''); // State for username/email error message
    const [passwordError, setPasswordError] = useState(''); // State for password error message
    const [userExists, setUserExists] = useState(null); // State to check if the user exists
    const [error, setError] = useState(null); // State for general error messages
  
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
  
        // Reset error messages
        setUsernameOrEmailError('');
        setPasswordError('');
          
        let isValid = true;
  
        // Validation checks for username or email and password
        if (!validateUsernameOrEmail(usernameOrEmail)) {
            setUsernameOrEmailError('Invalid email format or empty username.'); // Set error message for username/email
            isValid = false;
        }
  
        if (!validatePassword(password)) {
            setPasswordError('Password cannot be empty.'); // Set error message for password
            isValid = false;
        }
  
        if (!isValid) return; // Exit if validation fails
  
        try {
            // Send login request to backend
            const response = await axios.post('http://localhost:8000/reviewer/', {
                username_or_email: usernameOrEmail,
                password: password
            });
  
            onAuthSuccess(); // Call onAuthSuccess callback
            setUserExists(response.data.exists); // Set user existence based on response
            setError(null); // Reset any existing error messages
        } catch (error) {
            setError('An error occurred while checking the account.'); // Set error message if request fails
            console.error(error);
        }
  
        onAuthSuccess(); // Call onAuthSuccess callback again (could be redundant)
    };
  
    const handleGoogleLogin = () => {
        // Handle Google login logic
        console.log('Google login clicked'); // Log Google login action
    };
  
    return (
        <div className="login-container">
            {/* Widget 1: Greeting Text */}
            <div className="greeting">Welcome Back</div>
  
            {/* Login Form */}
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                      
                    {/* Widget 2: Username or Email Input Field */}
                    <div className="input">
                        <label>
                            Username or Email
                            {usernameOrEmailError && <span className="error">{usernameOrEmailError}</span>} {/* Display error message if any */}
                        </label>
                        <div className={`input-field ${usernameOrEmailError ? 'error-border' : ''}`}>
                            <input
                                type="text"
                                placeholder="Enter username or email"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)} // Update username/email state
                            />
                        </div>
                    </div>
                      
                    {/* Widget 3: Password Input Field */}
                    <div className="input">
                        <label>
                            Password
                            {passwordError && <span className="error">{passwordError}</span>} {/* Display error message if any */}
                        </label>
                        <div className={`input-field ${passwordError ? 'error-border' : ''}`}>
                            <img src={passwordIcon} alt="Password Icon" /> {/* Display password icon */}
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} // Update password state
                            />
                        </div>
                     </div>
                </div>
                  
                {/* Widget 4: Forgot Password Link */}
                <div className="forgot-password-container">
                    <div className="forgot-password" onClick={() => {/* Handle forgot password logic */}}>
                        Forgot Password?
                    </div>
                </div>
                  
                  {/* Widget 5: Submit Button */}
                  <div className="submit-container">
                      <button type="submit" className="submit">
                          Login
                      </button>
                  </div>
                  
                  {/* Divider for separating Google login */}
                  <hr className="divider" />
  
                  {/* Widget 6: Google Login Button */}
                  <div className="login-google" onClick={handleGoogleLogin}>
                      <img src={googleIcon} alt="Google Icon" className="google-icon" /> {/* Display Google icon */}
                      <span>Login with Google</span>
                  </div>
  
                  {/* Widget 7: Toggle Text (Link to Sign Up) */}
                  <div className="toggle-text">
                      <span className="text">Don&apos;t have an account? </span>
                      <span className="link" onClick={onToggle}>Sign Up here</span> {/* Link to sign up */}
                  </div>
              </form>
  
              {/* Widget 8: User Existence Messages */}
              {userExists === true && <p>User already has an account.</p>} {/* Message for existing user */}
              {userExists === false && <p>No account found with this information.</p>} {/* Message for non-existing user */}
              {error && <p>{error}</p>} {/* Display general error message */}
          </div>
      );
  };
  
  // Define the prop types
  Login.propTypes = {
      onToggle: PropTypes.func.isRequired,  // Validate that onToggle is a function and required
      onAuthSuccess: PropTypes.func.isRequired,  // Validate that onAuthSuccess is a function and required
  };
  
  export default Login;
  