import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sweet50Page.css";
import Navbar from "../../Navbar";

export default function Sweet50Page() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = ["All", ...new Set(books.map((b) => b.category).filter(Boolean))];

  // 🔹 Filter buku dengan diskon 50%
  const discountedBooks = books
    .filter(book => 
      (book.rating >= 4.5 || 
       book.category?.includes("Fiksi") || 
       book.category?.includes("Romantis") ||
       book.category?.includes("Fantasi"))
    )
    .filter(book =>
      (book.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.author || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((b) => (selectedCategory === "All" ? true : b.category === selectedCategory));

  const renderStars = (rating = 0) => {
    const r = Math.floor(Number(rating) || 0);
    return <span className="book-rating">{"★".repeat(Math.max(0, Math.min(5, r)))}</span>;
  };

  if (loading) return <div className="sweet50-container"><h2>Memuat buku diskon...</h2></div>;

  return (
    <div className="sweet50-container">
      <Navbar />

      {/* Header Section */}
      <div className="sweet50-header">
        <button 
          onClick={() => navigate("/admin-dashboard")}
          className="back-button"
        >
          <span className="back-icon">←</span>
          Kembali ke Dashboard
        </button>
        
        <div className="header-content">
          <h1 className="sweet50-title">🎉 Sweet 50% Off</h1>
          <p className="sweet50-subtitle">
            Nikmati diskon spesial 50% untuk buku-buku pilihan terbaik!
          </p>
        </div>

        {/* Discount Badge */}
        <div className="discount-badge">
          <span className="discount-text">50% OFF</span>
        </div>
      </div>

      {/* Search Bar - SAMA PERSIS seperti di AdminDashboard */}
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
        
        {/* Category Filter */}
        <div className="category-filter-container">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="discount-stats">
        <div className="stat-card">
          <h3>{discountedBooks.length}</h3>
          <p>Buku Diskon</p>
        </div>
        <div className="stat-card">
          <h3>50%</h3>
          <p>Potongan Harga</p>
        </div>
        <div className="stat-card">
          <h3>Terbatas</h3>
          <p>Waktu Promo</p>
        </div>
      </div>

      {/* Books Grid */}
      <section className="discount-books-section">
        <h2 className="section-title">Buku dengan Diskon 50%</h2>
        
        {discountedBooks.length > 0 ? (
          <div className="discount-books-grid">
            {discountedBooks.map((book) => (
              <div key={book.id} className="discount-book-card">
                {/* Discount Badge */}
                <div className="discount-tag">50% OFF</div>

                <div className="book-cover-container">
                  <img
                    src={book.cover || "https://via.placeholder.com/300x400?text=No+Cover"}
                    alt={book.title}
                    className="book-cover"
                    onError={(e) => { 
                      e.target.src = "https://via.placeholder.com/300x400?text=Error"; 
                    }}
                  />
                  <div className="book-overlay">
                    <Link to={`/books/${book.id}`} className="view-details-btn">
                      Lihat Detail
                    </Link>
                  </div>
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.title || "Tanpa Judul"}</h3>
                  <p className="book-author">by {book.author || "Tidak Diketahui"}</p>

                  <div className="book-meta">
                    <span className="book-category">{book.category || "Umum"}</span>
                    <span className="book-year">{book.published || ""}</span>
                  </div>

                  <div className="book-rating-area">
                    {renderStars(book.rating)}
                    <span>{book.rating ?? "N/A"}</span>
                  </div>

                  {/* Price Section */}
                  <div className="price-section">
                    <span className="original-price">Rp 150.000</span>
                    <span className="discounted-price">Rp 75.000</span>
                  </div>

                  <p className="book-description">
                    {book.description 
                      ? (book.description.length > 100 
                          ? `${book.description.substring(0, 100)}...` 
                          : book.description)
                      : "Deskripsi tidak tersedia."
                    }
                  </p>

                  <div className="book-actions">
                    <Link to={`/books/${book.id}`} className="primary-btn">
                      Beli Sekarang
                    </Link>
                    <button className="wishlist-btn">❤️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-books">
            <div className="no-books-icon">📚</div>
            <h3>Tidak ada buku diskon saat ini</h3>
            <p>Coba lagi nanti atau periksa promo lainnya</p>
            <button 
              onClick={() => navigate("/admin-dashboard")}
              className="back-to-home-btn"
            >
              Kembali ke Dashboard
            </button>
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div className="promo-content">
          <h3>🔥 Promo Spesial Akhir Tahun</h3>
          <p>Dapatkan diskon 50% untuk semua buku kategori Fiksi dan Romantis</p>
          <small>Promo berlaku hingga 31 Desember 2024</small>
        </div>
      </div>
    </div>
  );
}