import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async (formData) => {
    try {
      const response = await axios.post(
        'https://music-app-backend-fn92.onrender.com/auth/login',
        {
          email: formData.email,  
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000,
        }
      );
      if (response.status === 200) {
        enqueueSnackbar("Logged in successfully", { variant: "success" });
        persistLogin(response.data.token, response.data.userName);  
        setIsLoggedIn(true); 
        navigate('/playlists');
      }
    } catch (error) {
      console.log(error)
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable, and returns valid JSON.",
        { variant: "error" }
      );
    }
  };

  const persistLogin = (token, userName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);  
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setIsLoggedIn(false); 
    enqueueSnackbar("Logged out successfully", { variant: "info" });
    navigate('/'); 
  };

  return (
    <div className="container mt-5">
      {isLoggedIn ? (
        <div>
          <h2>Welcome, {localStorage.getItem("userName")}</h2>
          <button onClick={logout} className="btn btn-secondary">Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;