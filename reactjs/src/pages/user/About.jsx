// src/pages/About.jsx
import React from 'react';
import Navbar from "../../Navbar";
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Navbar />

     
    

      {/* Bagian Bawah: Misi & Visi — SAMPING-SAMPINGAN */}
          <div className='container'>
          <div className="mission-vision-grid">
            <div className="mission-card">
              <h2>Misi Kami</h2>
              <p>
                Menyediakan akses mudah ke ribuan buku dari berbagai genre, mendorong budaya literasi, dan menciptakan pengalaman membaca yang menyenangkan bagi semua kalangan.
              </p>
            </div>
            <div className="vision-card">
              <h2>Visi Kami</h2>
              <p>
                Menjadi platform baca digital terdepan di Indonesia yang menginspirasi jutaan orang untuk terus belajar melalui buku.
              </p>
            </div>
            </div>
          </div>

          
      
        

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

       {/* === SATU CONTAINER BESAR — KATALOG + MISI & VISI === */}
      <section className="catalog-mission-container">
        <div className="container">
          {/* Bagian Atas: Ilustrasi Buku Saja (tanpa teks) */}
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

          {/* Garis Pemisah */}
          <div className="divider"></div>

          
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
            <a href="mailto:support@edubooks.com"> support@edubooks.com</a>
            <a href="https://wa.me/6283848344688" target="_blank" rel="noopener noreferrer">
               +62 838-4834-4688
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