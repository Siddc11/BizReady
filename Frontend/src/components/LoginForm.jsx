import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import googleLogo from "../assests/google.png";
import mockImage from "../assests/mock.jpg";
import "../styles/LoginForm.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { loginUser } from "../../controllers/LoginController";
import Spinner from "./Spinner";
import { LoginContext } from "../context/LoginContext";
import { Input, Textarea } from '@chakra-ui/react'


const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUserLogin = async (e) => {
    setLoading(true); // Set loading to true before making the API call
    try {
      const userData = {
        emailId: email,
        password: password,
      };
      const response = await loginUser(userData);
      sessionStorage.setItem("token", response.token);
      sessionStorage.setItem("role", jwtDecode(response.token).role);
      // Additional logic after successful login, if needed
      console.log("User logged in successfully!", response);
      setIsLoggedIn(true);
      navigate("/feed");
    } catch (error) {
      alert(error.message);
      console.error("Error logging in:", error.message);
      // Additional error handling logic if needed
    } finally {
      setLoading(false); // Set loading back to false after the API call completes
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-side animate__animated animate__fadeIn">
        <form className="my-form">
          <div className="form-welcome-row">
            <h1>Welcome Back! &#x1F44F;</h1>
            <h2>Login with your account!</h2>
          </div>

          <div className="text-field">
            {/* <label htmlFor="email" className="input-label">
              Email
            </label> */}
            <Input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="text-field">
            {/* <label htmlFor="password">Password</label> */}
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              title="Minimum 6 characters at least 1 Alphabet and 1 Number"
              pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button
            style={{ display: loading ? "none" : "block" }}
            onClick={handleUserLogin}
            type="button"
            className="btn btn-primary"
          >
            Login
          </button>
          <div
            className="spinner"
            style={{
              margin: "auto",
              justifyContent: "center",
              display: loading ? "block" : "none",
            }}
          >
            <Spinner />
          </div>

          <div className="my-form__actions">
            <NavLink
              to="/Signup"
              className={({ isActive }) =>
                `${isActive ? "active-nav" : null} nav-link`
              }
            >
              <a title="Create Account" className="create-account-link">
                Don't have an account? <strong>Sign Up</strong>
              </a>
            </NavLink>
          </div>

          <div className="divider">
            <div className="divider-line"></div>
            <span>OR</span>
            <div className="divider-line"></div>
          </div>
          <div className="socials-row">
            <a href="/" title="Use Google">
              <img src={googleLogo} alt="Google" />
              <span>Continue with Google</span>
            </a>
          </div>
        </form>
      </div>
      <div className="info-side">
        <img src={mockImage} alt="Mock" className="mockup" />
      </div>
    </div>
  );
};
export default LoginForm;