import React, { useContext } from "react";
import Button from "./Button";
import { Link,useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";


const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  // simple logout handler (just clear state/localStorage etc.)
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
    console.log("Logged out successfully");
    setIsLoggedIn(false);
  };

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
          {/* Brand */}
          <Link to="/" className="navbar-brand fs-3 fw-bold text-dark">
            Crystal Chart
          </Link>

          {/* Toggler button */}
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

          {/* Menu */}
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarMenu"
          >
            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                // If logged in show Dashboard + Logout
                <>
                  <li className="nav-item me-2">
                    <Button
                      className="btn-outline-dark"
                      text="Dashboard"
                      url="/dashboard"
                    />
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-dark"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                // If NOT logged in show Login + Sign Up
                <>
                  <li className="nav-item me-2">
                    <Button
                      className="btn-outline-dark"
                      text="Login"
                      url="/login"
                    />
                  </li>
                  <li className="nav-item">
                    <Button
                      className="btn-outline-dark"
                      text="Sign Up"
                      url="/register"
                    />
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
