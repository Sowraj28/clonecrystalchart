import React from "react";
import Button from "./Button"; // ✅ Import reusable Button

const Header = () => {
  return (
    <>
      <header className="sticky-top" style={{ width: "100%", height: "70px" }}>
        <nav
          className="navbar navbar-expand-md navbar-light"
          style={{
            background:
              "linear-gradient(90deg, rgba(150, 120, 250, 1) 0%, rgb(211, 167, 249) 50%, rgba(150,120,250,1) 100%)",
          }}
        >
          {/* Brand / Title */}
          <a href="/" className="navbar-brand fs-3 fw-bold text-dark">
            Crystal Chart
          </a>

          {/* Toggler button (hamburger) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
            aria-controls="navbarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Menu */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarMenu"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-2">
                <Button className="btn-outline-dark" text="Login" />
              </li>
              <li className="nav-item">
                <Button className="btn-outline-dark" text="Register" />
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
