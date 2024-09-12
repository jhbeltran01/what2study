import emailIcon from '@assets/email.png';
import passwordIcon from '@assets/password.png';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import axios from 'axios';



const Login = ({ onToggle }) => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [userExists, setUserExists] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/reviewer/', {
                username_or_email: usernameOrEmail,
            });

            setUserExists(response.data.exists);
            setError(null);
        } catch (error) {
            setError('An error occurred while checking the account.');
            console.error(error);
        }
    };
    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="inputs">
                <div className="input">
                    <label>Email</label>
                    <div className="input-field">
                        <img src={emailIcon} alt="Email Icon" />
                        <input
                            type="text"
                            placeholder="Enter username or email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />

                    </div>
                </div>
                <div className="input">
                    <label>Password</label>
                    <div className="input-field">
                        <img src={passwordIcon} alt="Password Icon" />
                        <input type="password" placeholder="Password" />
                    </div>
                </div>
            </div>
            <div className="forgot-password-container">
                <div className="forgot-password" onClick={() => {/* Handle forgot password logic */}}>
                    Forgot Password?
                </div>
            </div>
            <div className="submit-container">
                <div className="submit" >
                    Login
                </div>
                <div className="toggle-text">
                <span className="text">Don&apos;t have an account? </span>
                <span className="link" onClick={onToggle}>Sign Up here</span>
                </div>
            </div>
            </form>
            {userExists === true && <p>User already has an account.</p>}
            {userExists === false && <p>No account found with this information.</p>}
            {error && <p>{error}</p>}
        </>
    );
};

// Define the prop types
Login.propTypes = {
    onToggle: PropTypes.func.isRequired,  // Validate that onToggle is a function and required
};

export default Login;
