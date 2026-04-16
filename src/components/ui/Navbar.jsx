import React from "react";

const Navbar = ({ username = "hp", onLogout }) => {
  return (
    <nav className="cc-nav">
      <div className="cc-logo">
        <div className="cc-logo-dot" />
        Career Catalyst
      </div>
      <div className="cc-nav-right">
        <span className="cc-nav-user">{username}</span>
        <button className="cc-nav-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;