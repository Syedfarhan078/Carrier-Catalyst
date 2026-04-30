import React from "react";

const Navbar = ({ username = "User", onLogout }) => {
  return (
    <nav className="cc-nav" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="cc-logo" style={{ animation: "slideInLeft 0.4s ease-out" }}>
        <div className="cc-logo-dot" />
        Career Catalyst
      </div>

      <div className="cc-nav-right">
        <span
          className="cc-nav-user"
          style={{ animation: "fadeIn 0.3s ease-out 0.2s both" }}
        >
          Welcome, {username}
        </span>

        <button
          className="cc-nav-btn"
          onClick={onLogout}
          style={{ animation: "slideInRight 0.4s ease-out 0.1s both" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;