import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import Button from "./Button";
import ChatBot from "./dashboard/ChatBot"; // import ChatBot component

const Header = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);

    if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  };

  // Show chat button only if not on login/register page
  const showChatBtn =
    location.pathname !== "/login" && location.pathname !== "/register";

  return (
    <header className="sticky-top" style={{ width: "100%", height: "70px" }}>
      <nav
        className="navbar navbar-expand-md navbar-light"
        style={{
          background:
            "linear-gradient(90deg, rgba(203, 254, 245, 0.95) 20%, rgba(255, 255, 255, 0.95)  30%, rgba(203, 254, 245, 0.95) 100%)",
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

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarMenu"
        >
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                {showChatBtn && (
                  <li className="nav-item me-2">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setShowChat((prev) => !prev)}
                    >
                      💬 Chat
                    </button>
                  </li>
                )}
                {location.pathname === "/dashboard" ? (
                  <li className="nav-item me-2">
                    <Button className="btn-outline-dark" text="Home" url="/" />
                  </li>
                ) : (
                  <li className="nav-item me-2">
                    <Button
                      className="btn-outline-dark"
                      text="Dashboard"
                      url="/dashboard"
                    />
                  </li>
                )}

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
              <>
                <li className="nav-item me-2">
                  <Button
                    className="btn-outline-dark"
                    text="Login"
                    url="/login"
                  />
                </li>

                {showChatBtn && (
                  <li className="nav-item me-2">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => setShowChat((prev) => !prev)}
                    >
                      💬 Chat
                    </button>
                  </li>
                )}

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

      {/* ChatBot component with close functionality */}
      {showChat && (
        <ChatBot from={location.pathname} onClose={() => setShowChat(false)} />
      )}
    </header>
  );
};

export default Header;
