import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({ userName: '', email: '', password: '', gender: '' });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const registerUser = async (formData) => {
    try {
      const response = await axios.post(
        'https://music-app-backend-fn92.onrender.com/auth/register',
        {
          userName: formData.userName, // Ensure correct casing
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000, // Timeout setting
        }
      );
      enqueueSnackbar("Registered successfully", { variant: "success" });
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable, and returns valid JSON.",
          { variant: "error" }
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerUser(formData);
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            className="form-control" 
            name="userName"  // Ensure correct casing
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
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
        <div className="form-group">
          <label>Gender</label>
          <select 
            className="form-control" 
            name="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Register</button>
      </form>
    </div>
  );
}

export default Register;