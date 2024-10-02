import PropTypes from 'prop-types';
import React, { useState } from 'react';
//import '../../sass/pages/_authentication.scss';
import Login from './Login';
import Signup from './Signup';

const Auth = ({ onAuthSuccess }) => {
    const [action, setAction] = useState("Sign Up");

    return (
        <div className='auth-page'> {/* Apply the scoped class */}
            <div className="container">
                <div className="header">
                    {action === "Sign Up" ? (
                        <Signup onToggle={() => setAction("Login")} onAuthSuccess={onAuthSuccess} />
                    ) : (
                        <Login onToggle={() => setAction("Sign Up")} onAuthSuccess={onAuthSuccess} />
                    )}
                </div>
            </div>
        </div>
    );
};

// Define the prop types
Auth.propTypes = {
    onAuthSuccess: PropTypes.func.isRequired,  // Validate that onAuthSuccess is a function and required
};

export default Auth;
