// src/pages/About.jsx
import React from 'react';
import Navbar from "../../Navbar";
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

      {/* ===== HERO SECTION ===== */}
      <section className="about-hero">
        <div className="container">
          <h1>Tentang <span>EduBooks</span></h1>
          <p>
            Platform baca digital yang menghubungkan pecinta buku dengan ribuan koleksi 
            dari berbagai genre. Temukan, baca, dan bagikan pengalaman membaca Anda.
          </p>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="mission-section">
        <div className="container">
          <div className="section-header">
            <h2>Visi &amp; <span>Misi</span></h2>
            <p>Menjadi jembatan antara pembaca dan pengetahuan</p>
          </div>
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">🌟</div>
              <h2>Visi Kami</h2>
              <p>
                Menjadi platform baca digital terdepan di Indonesia yang 
                menginspirasi jutaan orang untuk terus belajar melalui buku.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">🎯</div>
              <h2>Misi Kami</h2>
              <p>
                 Menyediakan akses mudah ke ribuan buku dari berbagai genre, 
                mendorong budaya literasi, dan menciptakan pengalaman membaca 
                yang menyenangkan bagi semua kalangan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALUES ===== */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Nilai yang <span>Kami Junjung</span></h2>
            <p>Prinsip yang menjadi dasar kami dalam melayani pembaca</p>
          </div>
          <div className="values-grid">
            {[
              { icon: '', title: "Kualitas", desc: "Kurasi buku terbaik dari penerbit tepercaya." },
              { icon: '', title: "Aksesibilitas", desc: "Bisa diakses kapan saja, di mana saja." },
              { icon: '', title: "Keamanan", desc: "Data pribadi Anda selalu terlindungi." },
              { icon: '', title: "Komunitas", desc: "Wadah berbagi dan diskusi antar pecinta buku." }
            ].map((item, i) => (
              <div className="value-card" key={i}>
                <div className="value-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATALOG - JANGAN DIUBAH ===== */}
      <section className="catalog-mission-container">
        <div className="container">
          <div className="catalog-header">
            <div className="catalog-image">
              <div className="book-stack">
                <div className="book book-1"></div>
                <div className="book book-2"></div>
                <div className="book book-3"></div>
                <div className="book book-4"></div>
                <div className="book book-5"></div>
              </div>
            </div>
          </div>
          <div className="divider"></div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">10.000+</span>
              <span className="stat-label">Buku Tersedia</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">50.000+</span>
              <span className="stat-label">Pembaca Aktif</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Kategori</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-wrapper">
            <h2>Hubungi Kami</h2>
            <p>Kami terbuka untuk saran, kolaborasi, atau sekadar ngobrol tentang buku!</p>
            <div className="contact-links">
              <a href="mailto:support@edubooks.com" className="contact-link">
                <span className="contact-icon"></span> support@edubooks.com
              </a>
              <a href="https://wa.me/6283848344688" target="_blank" rel="noopener noreferrer" className="contact-link">
                <span className="contact-icon"></span> +62 838-4834-4688
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="about-footer">
        <div className="container">
          <p>© 2026 EduBooks.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;