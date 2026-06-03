import React, { useState } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    alert('Login functionality would open here');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    alert('Sign up functionality would open here');
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <div className="logo-text">
              <i className="fas fa-graduation-cap"></i>
              Prepitus
            </div>
          </div>
          <nav className={isMobileMenuOpen ? 'active' : ''} id="main-nav">
            <ul>
              <li><a href="index.html" onClick={closeMobileMenu}>Home</a></li>
              <li><a href="#" onClick={closeMobileMenu}>Knowledge Concept</a></li>
              <li><a href="#" onClick={closeMobileMenu}>Assigned Activities</a></li>
              <li><a href="#" onClick={closeMobileMenu}>Exam</a></li>
              <li><a href="#" onClick={closeMobileMenu}>Blog</a></li>
              <li><a href="#" onClick={closeMobileMenu}>FAQ</a></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <a href="#" className="btn btn-outline" id="login-btn" onClick={handleLogin}>Login</a>
            <a href="#" className="btn btn-primary" id="signup-btn" onClick={handleSignup}>Sign Up</a>
          </div>
          <button className="mobile-menu-btn" id="mobile-menu-btn" onClick={toggleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;