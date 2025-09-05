import React from "react";
import Button from "./Button"; // ✅ Import with capital B

const Main = () => {
  return (
    <>
      
      <div className="container d-flex justify-content-center align-items-center vh-100 mb-5">
        <div className="p-5 border align-items-center rounded-3 text-center text-dark bg-light-dark">
          <h2 className="text-dark">Crystal Chart</h2>
          <h3 className="lead">
            Welcome to the Crystal Chart application. This platform provides
            insightful data visualizations and predictions to help you make
            informed decisions in the stock market.
          </h3>

          {/* ✅ Use custom Button component */}
          <Button className="btn-outline-dark" text="Login" url="/login" />
        </div>
      </div>

      
    </>
  );
};

export default Main;
