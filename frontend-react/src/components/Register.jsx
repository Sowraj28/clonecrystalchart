import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Register = () => {
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [errors,setErrors]=useState({});
  const [success,setSuccess]=useState(false);
  const [loading,setLoading]=useState(false);
  const handleRegistration= async (e) =>{
    e.preventDefault();
    setLoading(true);
    // Prepare user data
    const userData = {
      username,email,password
    }
    console.log("userData==>",userData);

    
    try{
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/v1/register/",
        userData
      );
      console.log("response.data==>",response.data)
      console.log("Registration Successful");
      setErrors({})
      setSuccess(true)
    }catch(error){
      setErrors(error.response.data);
      console.log("Registration Failed",error.response.data);

   }finally{
    setLoading(false);
   }
  }


  return (
    <>
      <div className="container mt-5 align-items-center  ">
        <div className="row justify-content-center mt-5">
          <div
            className="col-md-6 bg-light-dark rounded-1 p-4 shadow-lg"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            <h3 className="text-dark text-center mb-3">Create An Account</h3>
            <form onSubmit={handleRegistration}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control text-light bg-dark "
                  placeholder="Username "
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <small>
                  {errors.username && (
                    <div style={{ color: "rgba(248, 0, 0, 1)" }}>
                      {errors.username}
                    </div>
                  )}
                </small>
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control text-light bg-dark "
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small>
                  {errors.email && (
                    <div style={{ color: "rgba(248, 0, 0, 1)" }}>
                      {errors.email}
                    </div>
                  )}
                </small>
              </div>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control text-light bg-dark "
                  placeholder="Create Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <small>
                  {errors.password && (
                    <div style={{ color: "rgba(248, 0, 0, 1)" }}>
                      {errors.password}
                    </div>
                  )}
                </small>
              </div>
              {success && (
                <div className="alert alert-success">Sign UP Successful</div>
              )}
              {loading ? (
                <button
                  type="submit"
                  className="btn btn-outline-dark d-block mx-auto "
                  style={{
                    backgroundColor: " rgba(148, 234, 252, 1)",
                  }}
                  disabled
                >
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Please Wait...
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-outline-dark d-block mx-auto "
                  style={{
                    backgroundColor: " rgba(250, 246, 48, 1) ",
                  }}
                >
                  Sign Up
                </button>
              )}
              <div className="text-center mt-3">
                <span style={{ color: "#000000ff" }}>
                  Do you have an account?{" "}
                  <Link
                    to="/login"
                    style={{ color: "#0000fdff", textDecoration: "none" }}
                  >
                    Login
                  </Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register