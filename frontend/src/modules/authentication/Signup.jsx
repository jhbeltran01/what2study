import googleIcon from '@assets/google.png';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const validateUsername = (username) => /^[a-zA-Z0-9]{3,20}$/.test(username);
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const Signup = ({ onToggle, onAuthSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
    
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
    
        let isValid = true;
    
        if (!username) {
            setUsernameError('Please provide a username.');
            isValid = false;
        }
        if (!email) {
            setEmailError('Please provide an email.');
            isValid = false;
        } 
        
        if (!password) {
            setPasswordError('Please provide a password.');
            isValid = false;
        }
    
        if (username && !validateUsername(username)) {
            setUsernameError('Username must be 3-20 characters long with only letters and numbers.');
            isValid = false;
        }
        if (email && !validateEmail(email)) {
            setEmailError('Email must be in a valid format.');
            isValid = false;
        }
        if (password && !validatePassword(password)) {
            setPasswordError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
            isValid = false;
        }
    
        if (!isValid) return;
    
        localStorage.setItem('user', JSON.stringify({ username, email, password }));
    
        alert('Signup successful!');
        onAuthSuccess(); 
    };
    

    const toggleTermsModal = () => setIsTermsModalVisible(!isTermsModalVisible);

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
                                className={usernameError ? 'error-placeholder' : ''}
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
                                className={emailError ? 'error-placeholder' : ''}
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
                                className={passwordError ? 'error-placeholder' : ''}
                            />
                        </div>
                    </div>
                </div>

                <div className="terms-container">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="terms">
                        I agree to the <a href="#" onClick={toggleTermsModal}>terms and conditions</a>.
                    </label>
                </div>

                <div className="submit-container">
                    <button
                        type="submit"
                        className="submit"
                        disabled={!termsAccepted}
                    >
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

            {isTermsModalVisible && (
                <div className="terms-modal">
                    <div className="terms-modal-content">
                        <h2>TERMS AND CONDITIONS</h2>
                        <p><strong>Last updated:</strong> 10/13/2024</p>
                        <h3>AGREEMENT TO OUR LEGAL TERMS</h3>
                        <p>
                            These Legal Terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”), and BCDP, and concerning your access to and use of the Services. You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                        </p>
                        <p>
                            Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms from time to time. We will alert you about any changes by updating the “Last updated” date of these Legal Terms, and you waive any right to receive specific notice of each such change.
                        </p>
                        <button onClick={toggleTermsModal} className="terms-agree-btn">
                            I Agree
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

Signup.propTypes = {
    onToggle: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func.isRequired,
};

export default Signup;
