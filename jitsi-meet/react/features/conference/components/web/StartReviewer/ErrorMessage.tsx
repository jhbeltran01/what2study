import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="error-message-2 flex justify-center">
      <div className="submit-error black">{message}</div>
    </div>
  );
};

export default ErrorMessage;
