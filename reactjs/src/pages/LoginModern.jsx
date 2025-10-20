import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModern.css";

export default function LoginModern() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Redirect berdasarkan role
        if (data.user.role === "admin") {
          window.location.href = "/admin";
          console.log(data.user.role);
        } else {
          window.location.href = "/";
          console.log(data.user.role);
        }
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Terjadi kesalahan, coba lagi!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modern">
    

      
      <div className="login-container">
        {/* Header Section */}
        <div className="login-header">
          <h1 className="logo">
            EduBooks <span className="dot">.</span>
          </h1>
          <p className="tagline">Your Gateway to Amazing Stories</p>
        </div>

        {/* Login Form */}
        <div className="login-form-container">
          <div className="form-login-header">
            <h2>Welcome Back</h2>
            <p className="subtitle">
              Belum punya akun?{" "}
              <span className="link" onClick={() => navigate("/register")}>Register
              </span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="email">Alamat Email</label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="modern-input"
              />
              <span className="input-icon"></span>
            </div>

            <div className="input-group">
              <label htmlFor="password">Kata Sandi</label>
              <input
                id="password"
                type="password"
                placeholder="Masukkan kata sandi Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modern-input"
              />
              <span className="input-icon"></span>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Ingat saya
              </label>
              <span className="forgot-password">Lupa kata sandi?</span>
            </div>

            <button 
              type="submit" 
              className={`login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Memproses...
                </>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="social-divider">
            <span>Atau masuk dengan</span>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons">
            <button type="button" className="social-btn google">
              <span className="social-icon"></span>
              Google
            </button>
            <button type="button" className="social-btn facebook">
              <span className="social-icon"></span>
              Facebook
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>&copy; 2025 EduBooks. All rights reserved.</p>
        </div>
      </div>


    </div>
  );
}