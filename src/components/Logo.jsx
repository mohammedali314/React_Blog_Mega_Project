import logo from '../../src/images/logo-2150297_1920-removebg-preview.png'
import React from 'react';

const Logo = ({ width }) => {
  return (
    <img
      src={logo}  // Ensure the path is correct
      alt="Logo"
      style={{ width: width }}
      className="logo" // Add any necessary classes or styles
    />
  );
};

export default Logo;
