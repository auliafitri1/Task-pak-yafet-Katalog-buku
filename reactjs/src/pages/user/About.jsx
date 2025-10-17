
// src/pages/About.jsx
import React from 'react';
import Navbar from "../../Navbar";
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>Tentang <span>EduBooks</span></h1>
          <p>Platform digital yang hadir untuk menyatukan pecinta buku Indonesia dalam satu ekosistem membaca yang modern, aman, dan inspiratif.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="container">
          <div className="card">
            <h2>Misi Kami</h2>
            <p>Menyediakan akses mudah ke ribuan buku dari berbagai genre, mendorong budaya literasi, dan menciptakan pengalaman membaca yang menyenangkan bagi semua kalangan.</p>
          </div>
          <div className="card">
            <h2>Visi Kami</h2>
            <p>Menjadi platform baca digital terdepan di Indonesia yang menginspirasi jutaan orang untuk terus belajar melalui buku.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Nilai yang Kami Junjung</h2>
          <div className="values-grid">
            {[
              { title: "Kualitas", desc: "Kurasi buku terbaik dari penerbit tepercaya." },
              { title: "Aksesibilitas", desc: "Bisa diakses kapan saja, di mana saja." },
              { title: "Keamanan", desc: "Data pribadi Anda selalu terlindungi." },
              { title: "Komunitas", desc: "Wadah berbagi dan diskusi antar pecinta buku." }
            ].map((item, i) => (
              <div className="value-card" key={i}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stat-item">
            <span className="stat-number">10.000+</span>
            <span className="stat-label">Buku Tersedia</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50.000+</span>
            <span className="stat-label">Pembaca Aktif</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100+</span>
            <span className="stat-label">Kategori</span>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section">
        <div className="container">
          <h2>Hubungi Kami</h2>
          <p>Kami terbuka untuk saran, kolaborasi, atau sekadar ngobrol tentang buku!</p>
          <div className="contact-links">
            <a href="mailto:support@edubooks.com">📧 support@edubooks.com</a>
            <a href="https://wa.me/6283848344688" target="_blank" rel="noopener noreferrer">
              📱 +62 838-4834-4688
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <p>© 2025 EduBooks. All rights reserved. Dibuat dengan ❤️ untuk pembaca Indonesia.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
