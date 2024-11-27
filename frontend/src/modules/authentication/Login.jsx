import googleIcon from '@assets/google.png';
import passwordIcon from '@assets/password.png';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

// Utility functions for validation
const validateUsernameOrEmail = (usernameOrEmail) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail) || usernameOrEmail.trim().length > 0;
const validatePassword = (password) => password.trim().length > 0;

const Login = ({ onToggle, onAuthSuccess }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameOrEmailError, setUsernameOrEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [userExists, setUserExists] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Reset errors
        setUsernameOrEmailError('');
        setPasswordError('');

        let isValid = true;

        // Validation checks
        if (!validateUsernameOrEmail(usernameOrEmail)) {
            setUsernameOrEmailError('Invalid email format or empty username.');
            isValid = false;
        }

        if (!validatePassword(password)) {
            setPasswordError('Password cannot be empty.');
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await axios.post('http://localhost:8000/reviewer/', {
                username_or_email: usernameOrEmail,
                password: password,
            });

            onAuthSuccess();
            setUserExists(response.data.exists);
            setError(null);
        } catch (error) {
            setError('An error occurred while checking the account.');
            console.error(error);
        }
    };

    const handleGoogleLogin = () => {
        const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const redirectUri = 'http://127.0.0.1:8000';
        const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${googleClientId}&redirect_uri=${redirectUri}&scope=profile email`;

        window.location.href = googleLoginUrl;
    };

    return (
        <div className="login-container">
            <div className="greeting">Welcome Back</div>
            <form onSubmit={handleSubmit}>
                <div className="inputs">
                    <div className="input">
                        <label>
                            Username or Email
                            {usernameOrEmailError && <span className="error">{usernameOrEmailError}</span>}
                        </label>
                        <div className={`input-field ${usernameOrEmailError ? 'error-border' : ''}`}>
                            <input
                                type="text"
                                placeholder="Enter username or email"
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
                            <img src={passwordIcon} alt="Password Icon" />
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
                    <div className="forgot-password" onClick={() => { /* Handle forgot password logic */ }}>
                        Forgot Password?
                    </div>
                </div>
                <div className="submit-container">
                    <button type="submit" className="submit">
                        Login
                    </button>
                </div>
            </form>
            <hr className="divider" />
            {/* Google login button placed outside the form */}
            <div className="login-google">
                <button
                    type="button"
                    className="login-google-btn"
                    onClick={handleGoogleLogin} // Trigger Google login independently
                >
                    <img src={googleIcon} alt="Google Icon" className="google-icon" />
                    <span>Login with Google</span>
                </button>
            </div>
            <div className="toggle-text">
                <span className="text">Don&apos;t have an account? </span>
                <span className="link" onClick={onToggle}>Sign Up here</span>
            </div>
            {userExists === true && <p>User already has an account.</p>}
            {userExists === false && <p>No account found with this information.</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

Login.propTypes = {
    onToggle: PropTypes.func.isRequired, 
    onAuthSuccess: PropTypes.func.isRequired, 
};

export default Login;
