import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link to navigate to the Login page

const Register = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    username: "",  // Added username field
    user_role: "player", 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:3000/register", user);
        if (response.status === 201) {
            console.log("User registered:", response.data);
            window.location.href = "/login"; // Redirect to login page after successful registration
        } else {
            throw new Error("Failed to register user");
        }
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Failed to register user. Please try again.");
    }
};


  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" name="first_name" value={user.first_name} onChange={handleChange} />
        </label>
        <label>
          Last Name:
          <input type="text" name="last_name" value={user.last_name} onChange={handleChange} />
        </label>
        <label>
          Username:
          <input type="text" name="username" value={user.username} onChange={handleChange} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={user.password} onChange={handleChange} />
        </label>
        <label>
          Role:
          <select name="user_role" value={user.user_role} onChange={handleChange}>
            <option value="player">Player</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <button type="submit">Register</button>
      </form>

      {/* Link to login page */}
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;
