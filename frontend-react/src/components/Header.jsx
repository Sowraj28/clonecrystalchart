import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import Button from "./Button";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="sticky-top" style={{ width: "100%", height: "70px" }}>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{
          background:
            "linear-gradient(90deg, rgba(150, 120, 250, 1) 0%, rgb(211, 167, 249) 50%, rgba(150,120,250,1) 100%)",
        }}
      >
        <Link to="/" className="navbar-brand fs-3 fw-bold text-dark">
          Crystal Chart
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarMenu">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                {/* if we're on dashboard → show HOME, otherwise show DASHBOARD */}
                {location.pathname === "/dashboard" ? (
                  <li className="nav-item me-2">
                    <Button className="btn-outline-dark " text="Home" url="/" />
                  </li>
                ) : (
                  <li className="nav-item me-2">
                    <Button className="btn-outline-dark" text="Dashboard" url="/dashboard" />
                  </li>
                )}

                <li className="nav-item">
                  <button className="btn btn-outline-dark" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Button className="btn-outline-dark" text="Login" url="/login" />
                </li>
                <li className="nav-item">
                  <Button className="btn-outline-dark" text="Sign Up" url="/register" />
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
