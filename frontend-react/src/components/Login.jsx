import React, { useState,useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error,setError]=useState('')
  const {isLoggedIn,setIsLoggedIn}=useContext(AuthContext)


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const userData = {
      username,
      password
    }
    console.log("userData==>",userData);

    try{
      const response=await axios.post('http://127.0.0.1:8000/api/v1/token/',userData)
      localStorage.setItem('accessToken',response.data.access)
      localStorage.setItem('refreshToken',response.data.refresh)
      console.log('LogIn Successful');
      setIsLoggedIn(true)
      navigate('/')
    }catch(error){
      console.error('Invalid credentials')
      setError('Invalid credentials')
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <div className="container mt-5 align-items-center">
        <div className="row justify-content-center mt-5">
          <div
            className="col-md-6 bg-light-dark  rounded-1 p-4 shadow-lg"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          >
            <h3 className="text-dark text-center mb-3">
              Login To Your Account
            </h3>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control text-light bg-dark"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className="form-control text-light bg-dark"
                  placeholder=" Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <div style={{ color: "rgba(248, 0, 0, 1)" }}>{error}</div>}

              {loading ? (
                <button
                  type="submit"
                  className="btn btn-outline-dark d-block mx-auto"
                  style={{ backgroundColor: "rgba(150, 120, 250, 1)" }}
                  disabled
                >
                  <FontAwesomeIcon icon={faSpinner} spin /> Logging In...
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-outline-dark d-block mx-auto"
                  style={{ backgroundColor: "rgba(150, 120, 250, 1)" }}
                >
                  Login
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
