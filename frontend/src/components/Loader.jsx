import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Loader.css';

const Loader = ({ size = 'md', fullScreen = false, text = 'Loading...' }) => {
  const spinnerSizes = {
    sm: { width: '1.5rem', height: '1.5rem' },
    md: { width: '3rem', height: '3rem' },
    lg: { width: '5rem', height: '5rem' }
  };

  if (fullScreen) {
    return (
      <div className="loader-fullscreen">
        <div className="loader-content">
          <Spinner 
            animation="border" 
            variant="primary" 
            style={spinnerSizes[size]}
            className="mb-3"
          />
          <p className="loader-text">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <Spinner 
        animation="border" 
        variant="primary" 
        style={spinnerSizes[size]}
      />
      {text && <p className="loader-text mt-2">{text}</p>}
    </div>
  );
};

export default Loader;