// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      role,
    };

    try {
      console.log("Mengirim data:", newUser); // ← LOG untuk debugging

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      // ✅ PERBAIKAN: Hanya 1 kali response.json()
      const data = await response.json();
      console.log("Response dari server:", data); // ← LOG untuk debugging

      if (!response.ok) {
        // Tampilkan pesan error dari server
        let errorMessage = "Terjadi error saat registrasi";
        
        if (data.message) {
          errorMessage = data.message;
        }
        
        if (data.errors) {
          // Jika ada error validasi (laravel)
          const errorList = Object.values(data.errors).flat().join("\n");
          errorMessage = errorList || errorMessage;
        }
        
        alert("❌ Gagal registrasi:\n" + errorMessage);
        setIsLoading(false);
        return;
      }

      // Sukses!
      console.log("✅ Registrasi sukses:", data);

      // Simpan data ke localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("role", data.data?.role || role);
      localStorage.setItem("user", JSON.stringify(data.data || data.user));

      alert(`✅ Registrasi berhasil sebagai ${data.data?.role || role}!`);
      navigate("/login-modern");
      
    } catch (err) {
      console.error("❌ Fetch error:", err);
      alert(
        "❌ Tidak bisa terhubung ke server!\n\n" +
        "Pastikan:\n" +
        "1. Laravel berjalan di http://localhost:8000\n" +
        "2. Jalankan: php artisan serve\n" +
        "3. Cek koneksi internet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-modern">
      <div className="register-container">
        {/* Header Section */}
        <div className="register-header">
          <h1 className="logo">
            EduBooks <span className="dot">.</span>
          </h1>
          <p className="tagline">Your Gateway to Amazing Stories</p>
        </div>

        {/* Register Form */}
        <div className="register-form-container">
          <div className="form-register-header">
            <h2>Create Account</h2>
            <p className="subtitle">
              Sudah punya akun?{" "}
              <span className="link" onClick={() => navigate("/login-modern")}>
                Login
              </span>
            </p>
          </div>

          <form onSubmit={handleRegister} className="register-form">
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Masukkan nama depan Anda"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="modern-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Masukkan nama belakang Anda"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="modern-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">Alamat Email</label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan alamat email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="modern-input"
              />
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
                disabled={isLoading}
                className="modern-input"
              />
            </div>

            {/* Role Selection */}
            <div className="role-selection">
              <label className="role-label">Pilih Role</label>
              <div className="role-options">
                <label className="radio-container">
                  <input
                    type="radio"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                  />
                  <span className="radiomark"></span>
                  User
                </label>
                <label className="radio-container">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                  />
                  <span className="radiomark"></span>
                  Admin
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={`register-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Membuat Akun...
                </>
              ) : (
                'Buat Akun'
              )}
            </button>
          </form>

          {/* Social Register Divider */}
          <div className="social-divider">
            <span>Atau daftar dengan</span>
          </div>

          {/* Social Register Buttons */}
          <div className="social-buttons">
            <button type="button" className="social-btn google" disabled={isLoading}>
              <span className="social-icon"></span>
              Google
            </button>
            <button type="button" className="social-btn facebook" disabled={isLoading}>
              <span className="social-icon"></span>
              Facebook
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="register-footer">
          <p>&copy; 2024 EduBooks. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}