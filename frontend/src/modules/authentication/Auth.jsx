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

File Information: Auth.jsx
Purpose: Handles Signup and Login Pages Autehntication
***********************************************************************************************************************************/

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

File Information: Auth.jsx
Purpose: Handles Signup and Login Pages Autehntication
***********************************************************************************************************************************/

import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Auth = ({ onAuthSuccess }) => {
    const [action, setAction] = useState("Sign Up");

    return (
        <div className='auth-page'>
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

Auth.propTypes = {
    onAuthSuccess: PropTypes.func.isRequired,  // Ensures that onAuthSuccess is passed as a function
};

export default Auth;

