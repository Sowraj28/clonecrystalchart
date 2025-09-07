import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({ text, url, className }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`btn ${className}`}
      onClick={(e) => {
        e.currentTarget.blur(); // remove focus immediately to prevent outline
        navigate(url);
      }}
    >
      {text}
    </button>
  );
};

export default Button;
