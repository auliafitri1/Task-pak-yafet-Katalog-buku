import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './Books.css';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const booksSectionRef = useRef(null);

  // 🔁 Ref untuk auto-scroll
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const isHoveredRef = useRef(false);

  // Render bintang rating (simple)
  const renderStars = (rating = 0) => {
    const r = Math.floor(Number(rating) || 0);
    return (
      <span className="book-rating">
        {"★".repeat(Math.max(0, Math.min(5, r)))}
      </span>
    );
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

        const response = await fetch("http://localhost:8000/api/books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(`Gagal memuat buku: ${response.status} ${errorMsg}`);
        }

        const data = await response.json();
        
        // 🔥 PERBAIKAN: Handle berbagai format data
        if (Array.isArray(data)) {
          setBooks(data);
        } else if (data.data && Array.isArray(data.data)) {
          setBooks(data.data);
        } else {
          setBooks([]);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // 🔄 Auto-scroll logic
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || books.length === 0) return;

    let scrollAmount = 0;
    const scrollStep = 1;

    const autoScroll = () => {
      if (isHoveredRef.current) {
        animationRef.current = requestAnimationFrame(autoScroll);
        return;
      }

      carousel.scrollLeft += scrollStep;
      scrollAmount += scrollStep;

      if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
        setTimeout(() => {
          carousel.scrollLeft = 0;
          scrollAmount = 0;
        }, 50);
      }

      animationRef.current = requestAnimationFrame(autoScroll);
    };

    animationRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [books]);

  const categories = ["all", ...new Set(books.map((b) => b.category || "Unknown"))];

  const filteredBooks = books
    .filter((b) => (selectedCategory === "all" ? true : (b.category || "Unknown") === selectedCategory))
    .filter(
      (b) =>
        b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'title') return a.title?.localeCompare(b.title) || 0;
      if (sortBy === 'author') return a.author?.localeCompare(b.author) || 0;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
      return 0;
    });

 

  if (error)
    return (
      <div className="dashboard" style={{ color: "red", textAlign: "center", padding: "50px" }}>
        <h3>❌ Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Coba Lagi</button>
      </div>
    );

  return (
    <div className="dashboard">
      <Navbar />
      <div className="books-container">

        {/* Header Section */}
        <header className="books-header">
          <div className="header-content">
            <div className="hero-content">
              <h1 className="hero-title">
                <span className="highlight">Catalog</span> and<br />
                Library books
              </h1>
              <p>
                Temukan berbagai koleksi buku dengan berbagai genre untuk menambah koleksi buku Anda.
              </p>
              <button
                className="hero-btn"
                onClick={() => {
                  booksSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Search Books <span className="play-icon">🔎︎</span>
              </button>
            </div>
            <img src="/assets/home-header.png" alt="book-header" className="header-img" />
          </div>
        </header>

        {/* Search and Filters */}
        <section className="books-controls">
          <div className="search-box">
            <div className="search-icon"></div>
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters-container">
            <div className="filter-group">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "Unknown" ? "Unknown" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="rating">Rating</option>
                <option value="year">Year</option>
              </select>
            </div>
          </div>
        </section>

        {/* ✅ AUTO-SCROLL COVER CAROUSEL */}
        <section className="books-grid-section" ref={booksSectionRef}>
          <div className="books-stats">
            
          </div>

          {/* Kontainer carousel - ✅ PERBAIKAN: HAPUS DUPILKASI */}
          <div
            className="book-cover-carousel"
            ref={carouselRef}
            onMouseEnter={() => (isHoveredRef.current = true)}
            onMouseLeave={() => (isHoveredRef.current = false)}
          >
            {filteredBooks.length > 0 ? (
              // ✅ PERBAIKAN: Tampilkan 1x saja, TIDAK DIDUPLIKASI
              filteredBooks.map((book) => (
                <Link
                  key={book.id}
                  to={`/books/${book.id}`}
                  className="book-cover-item"
                >
                  <img
                    src={book.cover || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop'}
                    alt={book.title || "Book Cover"}
                    className="book-cover-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop';
                    }}
                  />
                </Link>
              ))
            ) : (
              <div className="no-books-message">Tidak ada buku ditemukan</div>
            )}
          </div>
          
        </section>

      
      </div>
    </div>
  );
};

export default Books;