import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import Navbar from "../../Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  // 🔹 Fungsi scroll geser kiri/kanan
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -650, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 650, behavior: "smooth" });
    }
  };

  // 🔹 Ambil data buku
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

        const res = await fetch("http://localhost:8000/api/books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Gagal memuat buku (${res.status})`);

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const categories = ["All", ...new Set(books.map((b) => b.category).filter(Boolean))];

  const filteredBooks = books
    .filter((b) => (selectedCategory === "All" ? true : b.category === selectedCategory))
    .filter(
      (b) =>
        (b.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.author || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

  const renderStars = (rating = 0) => {
    const r = Math.floor(Number(rating) || 0);
    return <span className="book-rating">{"★".repeat(Math.max(0, Math.min(5, r)))}</span>;
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus buku ini?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
        alert("Buku berhasil dihapus.");
      } else {
        alert("Gagal menghapus buku.");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat menghapus buku.");
    }
  };

  const handleEdit = (id) => navigate(`/admin/edit-book/${id}`);

  // ✅ PERBAIKAN: Loading state dengan spinner
  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat daftar buku...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="error-container" style={{ color: "red", textAlign: "center", padding: "50px" }}>
          <h3>❌ Error</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">Coba Lagi</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />

      {/* ================= Search Bar ================= */}
      <div className="search-section animate-fade-in-up">
        <div className="search-container">
          <input
            type="text"
            placeholder="Cari buku berdasarkan judul atau penulis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="clear-search">
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Konten utama */}
      <main className="content">
        <div className="hero-container">
          <aside className="sidebar">
            <h3>📂 Categories Books</h3>
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={selectedCategory === cat ? "active" : ""}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          <section className="hero">
            <h2>Selamat datang<br />Di Katalog Buku Aplikasi</h2>
            <p>EduBooks — Portal Digital Para Pecinta Buku! EduBooks hadir untuk memudahkan Anda menemukan buku favorit dengan cepat dan praktis. Jelajahi ribuan koleksi dari berbagai kategori, baca sinopsis menarik, dan temukan rekomendasi buku terbaik untuk menemani hari Anda. Belajar jadi lebih seru, hanya di EduBooks!</p>
            <button className="hero-button" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Cek Sekarang
            </button>
          </section>
        </div>
      </main>

      <main className="content">
        {/* ================= Quick Actions ================= */}
        <section className="quick-actions">
          <div className="action-buttons">
            <button className="action-btn active">Pilih</button>
            <button className="action-btn">Sweet 50%</button>
          </div>
        </section>

        {/* ================= Populer Section ================= */}
        <section className="populer-section animate-fade-in-up">
          <h2 className="populer-title"></h2>
          <div className="populer-carousel-container">
            <button className="carousel-arrow left" onClick={scrollLeft}>
              &#8249;
            </button>

            <div className="populer-layout" ref={carouselRef}>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <div key={book.id} className="populer-card">
                    <img
                      src={book.cover || "https://via.placeholder.com/300x400?text=No+Cover"}
                      alt={book.title}
                      className="populer-cover"
                    />
                    <div className="populer-info">
                      <h4>{book.title}</h4>
                      <p>by {book.author || "Tidak diketahui"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-books-message">Tidak ada buku ditemukan</div>
              )}
            </div>

            <button className="carousel-arrow right" onClick={scrollRight}>
              &#8250;
            </button>
          </div>
        </section>

        {/* Book Grid */}
        <section className="books-grid-section animate-fade-in-up">
          <div className="book-grid">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div key={book.id} className={`book-card ${book.isFeatured ? 'featured' : ''}`}>
                  {book.isFeatured && <div className="featured-badge">Featured</div>}

                  <div className="book-cover-container">
                    <img
                      src={book.cover || "https://via.placeholder.com/300x400?text=No+Cover"}
                      alt={book.title}
                      className="book-cover"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300x400?text=Error"; }}
                    />
                    <div className="book-overlay">
                      <Link to={`/books/${book.id}`} className="view-details-btn">View Details</Link>
                    </div>
                  </div>

                  <div className="book-info">
                    <h3 className="book-title">{book.title || "Tanpa Judul"}</h3>
                    <p className="book-author">by {book.author || "Tidak Diketahui"}</p>

                    <div className="book-meta">
                      <span className="book-category">{book.category || "Umum"}</span>
                      <span className="book-year">{book.published || book.year || ""}</span>
                    </div>

                    <div className="book-rating-area">
                      {renderStars(book.rating)}
                      <span style={{ marginLeft: 8 }}>{book.rating ?? "N/A"}</span>
                    </div>

                    <p className="book-description">
                      {((book.description || "")).length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : (book.description || "")}
                    </p>

                    <div className="book-actions" style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <Link to={`/books/${book.id}`} className="primary-btn">Read More</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", width: "100%", padding: "40px 0" }}>
                Tidak ada buku ditemukan.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}