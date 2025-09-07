import { useContext } from "react";
import Button from "./Button";
import { AuthContext } from "./AuthProvider";

const Main = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="container d-flex  justify-content-center align-items-center vh-100 mb-5">
      <div className="p-5 border bg-light-dark rounded-3 text-center text-dark bg-light">
        <h1 className="fw-bold text-dark">Crystal Chart</h1>
        <p className="lead mt-3">
          Track the pulse of the cryptocurrency market. Crystal Chart delivers{" "}
          <strong>real-time prices</strong>,
          <strong>7-day / 30-day history charts</strong> and
          <strong>AI-powered predictions</strong> for the world’s top coins.
        </p>

        <div className="mt-4">
          {isLoggedIn ? (
            <Button
              className="btn-outline-dark"
              text="Explore More"
              url="/dashboard"
            />
          ) : (
            <Button
              className="btn-outline-dark"
              text="Explore Now"
              url="/login"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
