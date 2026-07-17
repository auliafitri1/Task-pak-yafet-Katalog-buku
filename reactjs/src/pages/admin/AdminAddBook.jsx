  import React, { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import "./AdminAddBook.css";
  import Navbar from "../../Navbar";

  export default function AdminAddBook() {
    const navigate = useNavigate();
    const [book, setBook] = useState({
      title: "",
      author: "",
      cover: "",
      description: "",
      rating: "",
      pages: "",
      published: "",
      category: "",
      language: "Indonesia",
      publisher: "",
      isbn: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeSection, setActiveSection] = useState("basic");

    const categories_option = [
      "Fiksi",
      "Non-Fiksi",
      "Pengembangan Diri",
      "Teknologi",
      "Kesehatan",
      "Bisnis",
      "Sejarah",
      "Agama",
      "Komik",
      "Romantis",
      "Fantasi",
      "Sains"
    ];

    // Validasi form
    const validateForm = () => {
      const newErrors = {};

      if (!book.title.trim()) {
        newErrors.title = "Judul buku wajib diisi";
      }

      if (!book.author.trim()) {
        newErrors.author = "Penulis wajib diisi";
      }

      if (book.cover && !isValidUrl(book.cover)) {
        newErrors.cover = "URL cover tidak valid";
      }

      if (book.rating && (book.rating < 0 || book.rating > 5)) {
        newErrors.rating = "Rating harus antara 0-5";
      }

      if (book.pages && book.pages < 1) {
        newErrors.pages = "Jumlah halaman tidak valid";
      }

      if (book.published && (book.published < 1900 || book.published > new Date().getFullYear())) {
        newErrors.published = "Tahun terbit tidak valid";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string) => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: "" }));
      }

      setBook(prev => ({
        ...prev,
        [name]: value
      }));
    };

    // 🔥 FUNGSI FETCH BOOKS (DIPINDAHKAN KE ATAS)
    const fetchBooks = async () => {
      console.log("🔵 Fetch books dimulai...");
      
      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Token fetch:", token);

        if (!token) {
          setError("Token tidak ditemukan. Silakan login ulang.");
          return;
        }

        const response = await fetch("http://localhost:8000/api/books", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        console.log("📥 Fetch books status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Error response:", errorText);
          throw new Error(`Gagal memuat buku: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log("📚 Data buku dari API:", data);

        // Handle berbagai format data
        if (Array.isArray(data)) {
          setBooks(data);
        } else if (data.data && Array.isArray(data.data)) {
          setBooks(data.data);
        } else if (data.books && Array.isArray(data.books)) {
          setBooks(data.books);
        } else {
          console.warn("⚠️ Format data tidak dikenali:", data);
          setBooks([]);
          setError("Format data buku tidak sesuai");
        }
        
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching books:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data.");
        setBooks([]);
      }
    };

    // 🔥 HANDLE SUBMIT (DIPERBAIKI)
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      console.log("🔵 Tombol Simpan diklik!");
      console.log("📤 Data buku:", book);

      if (!validateForm()) {
        alert("Harap perbaiki kesalahan dalam form sebelum menyimpan.");
        return;
      }

      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        console.log("🔑 Token:", token);

        if (!token) {
          alert("❌ Silakan login terlebih dahulu!");
          navigate("/login");
          return;
        }

        console.log("📤 Mengirim data ke API:", JSON.stringify(book, null, 2));

        const response = await fetch("http://localhost:8000/api/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(book),
        });

        console.log("📥 Response status:", response.status);

        // Baca response sebagai text dulu
        const responseText = await response.text();
        console.log("📥 Response text:", responseText);

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("❌ Gagal parse JSON:", e);
          throw new Error("Response bukan JSON: " + responseText);
        }

        if (response.ok) {
          alert("✅ Buku berhasil ditambahkan!");
          console.log("✅ Sukses:", data);
          
          // Refresh daftar buku
          await fetchBooks();
          
          // Reset form
          handleReset();
          
          // Navigasi ke dashboard
          navigate("/admin-dashboard");
        } else {
          const errorMessage = data.message || data.error || JSON.stringify(data);
          alert(`❌ Gagal: ${errorMessage}`);
          console.error("❌ Error response:", data);
        }
      } catch (error) {
        console.error("❌ Catch error:", error);
        alert(`❌ Terjadi kesalahan: ${error.message}`);
      } finally {
        setLoading(false);
        console.log("🔵 Loading selesai");
      }
    };

    const handleReset = () => {
      setBook({
        title: "",
        author: "",
        cover: "",
        description: "",
        rating: "",
        pages: "",
        published: "",
        category: "",
        language: "Indonesia",
        publisher: "",
        isbn: "",
      });
      setErrors({});
      setActiveSection("basic");
    };

    const progress = () => {
      const filledFields = Object.values(book).filter(value => value !== "").length;
      return Math.min((filledFields / Object.keys(book).length) * 100, 100);
    };

    // 🔥 useEffect - panggil fetchBooks
    useEffect(() => {
      fetchBooks();
    }, []);

    const categories = ["All", ...new Set(books.map((b) => b.category))];

    const filteredBooks = books
      .filter((b) => (selectedCategory === "All" ? true : b.category === selectedCategory))
      .filter(
        (b) =>
          b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return (
      <div className="admin-add-book-container">
        <Navbar />
        
        {/* Main Content */}
        <div className="add-book-layout">
          
          {/* Left Side - Form */}
          <div className="form-side">
            <div className="form-container-card">
              {/* Header */}
              <div className="form-header">
                <button
                  onClick={() => navigate("/admin-dashboard")}
                  className="back-button"
                >
                  <span className="back-icon">←</span>
                  Kembali
                </button>
                <div className="header-content">
                  <h1>Tambah Buku Baru</h1>
                  <p></p>
                </div>
              </div>

              {/* Progress */}
              <div className="progress-card">
                <div className="progress-header">
                  <span className="progress-text">Progress Pengisian</span>
                  <span className="progress-percent">{Math.round(progress())}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress()}%` }}
                  ></div>
                </div>
                <div className="progress-detail">
                  {Object.values(book).filter(value => value !== "").length} dari {Object.keys(book).length} field terisi
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="section-tabs">
                {[
                  { id: 'basic', label: 'Informasi Dasar', icon: '' },
                  { id: 'details', label: 'Detail Buku', icon: '' },
                  { id: 'cover', label: 'Cover & Deskripsi', icon: '' },
                  { id: 'additional', label: 'Informasi Tambahan', icon: '' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    className={`tab-button ${activeSection === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveSection(tab.id)}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="book-form">
                
                {/* Section 1: Informasi Dasar Buku */}
                <div className={`form-section ${activeSection === 'basic' ? 'active' : ''}`}>
                  <div className="section-title">
                    <h3>Informasi Dasar Buku</h3>
                    <p>Informasi utama yang mengidentifikasi buku</p>
                  </div>

                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">
                        Judul Buku <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={book.title}
                        onChange={handleChange}
                        placeholder="Masukkan judul buku lengkap"
                        className={errors.title ? "input-error" : ""}
                      />
                      {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">
                        Penulis <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={book.author}
                        onChange={handleChange}
                        placeholder="Nama lengkap penulis"
                        className={errors.author ? "input-error" : ""}
                      />
                      {errors.author && <span className="error-text">{errors.author}</span>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Kategori</label>
                      <select
                        name="category"
                        value={book.category}
                        onChange={handleChange}
                      >
                        <option value="">Pilih Kategori</option>
                        {categories_option.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label">Penerbit</label>
                      <input
                        type="text"
                        name="publisher"
                        value={book.publisher}
                        onChange={handleChange}
                        placeholder="Nama penerbit"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Detail Buku */}
                <div className={`form-section ${activeSection === 'details' ? 'active' : ''}`}>
                  <div className="section-title">
                    <h3>Detail Buku</h3>
                    <p>Informasi tambahan tentang spesifikasi buku</p>
                  </div>

                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Tahun Terbit</label>
                      <input
                        type="number"
                        name="published"
                        value={book.published}
                        onChange={handleChange}
                        placeholder="2024"
                        min="1900"
                        max={new Date().getFullYear()}
                        className={errors.published ? "input-error" : ""}
                      />
                      {errors.published && <span className="error-text">{errors.published}</span>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Jumlah Halaman</label>
                      <input
                        type="number"
                        name="pages"
                        value={book.pages}
                        onChange={handleChange}
                        placeholder="300"
                        min="1"
                        className={errors.pages ? "input-error" : ""}
                      />
                      {errors.pages && <span className="error-text">{errors.pages}</span>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        step="0.1"
                        value={book.rating}
                        onChange={handleChange}
                        placeholder="4.5"
                        min="0"
                        max="5"
                        className={errors.rating ? "input-error" : ""}
                      />
                      {errors.rating && <span className="error-text">{errors.rating}</span>}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Bahasa</label>
                      <select
                        name="language"
                        value={book.language}
                        onChange={handleChange}
                      >
                        <option value="Indonesia">Indonesia</option>
                        <option value="English">English</option>
                        <option value="Other">Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Cover & Deskripsi */}
                <div className={`form-section ${activeSection === 'cover' ? 'active' : ''}`}>
                  <div className="section-title">
                    <h3>Cover & Deskripsi</h3>
                    <p>Gambar cover dan ringkasan buku</p>
                  </div>

                  <div className="form-full-width">
                    <div className="input-group">
                      <label className="input-label">URL Cover Buku</label>
                      <input
                        type="url"
                        name="cover"
                        value={book.cover}
                        onChange={handleChange}
                        placeholder="https://example.com/cover.jpg"
                        className={errors.cover ? "input-error" : ""}
                      />
                      {errors.cover && <span className="error-text">{errors.cover}</span>}

                      {book.cover && (
                        <div className="cover-preview">
                          <img
                            src={book.cover}
                            alt="Preview cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/200x300?text=Invalid+URL";
                            }}
                          />
                          <span className="preview-text">Preview Cover</span>
                        </div>
                      )}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Deskripsi Buku</label>
                      <textarea
                        name="description"
                        value={book.description}
                        onChange={handleChange}
                        placeholder="Tuliskan deskripsi singkat tentang buku ini..."
                        rows="4"
                        maxLength="500"
                      />
                      <div className="textarea-info">
                        <span>{book.description.length}/500 karakter</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Informasi Tambahan */}
                <div className={`form-section ${activeSection === 'additional' ? 'active' : ''}`}>
                  <div className="section-title">
                    <h3>Informasi Tambahan</h3>
                    <p>Data pendukung lainnya</p>
                  </div>

                  <div className="form-full-width">
                    <div className="input-group">
                      <label className="input-label">ISBN</label>
                      <input
                        type="text"
                        name="isbn"
                        value={book.isbn}
                        onChange={handleChange}
                        placeholder="978-3-16-148410-0"
                      />
                      <div className="input-note">
                        Format: 978-3-16-148410-0 (opsional)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="form-navigation">
                  <div className="nav-buttons">
                    {activeSection !== 'basic' && (
                      <button
                        type="button"
                        className="nav-button prev"
                        onClick={() => {
                          const sections = ['basic', 'details', 'cover', 'additional'];
                          const currentIndex = sections.indexOf(activeSection);
                          setActiveSection(sections[currentIndex - 1]);
                        }}
                      >
                        ← Sebelumnya
                      </button>
                    )}

                    {activeSection !== 'additional' ? (
                      <button
                        type="button"
                        className="nav-button next"
                        onClick={() => {
                          const sections = ['basic', 'details', 'cover', 'additional'];
                          const currentIndex = sections.indexOf(activeSection);
                          setActiveSection(sections[currentIndex + 1]);
                        }}
                      >
                        Selanjutnya →
                      </button>
                    ) : (
                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="action-button secondary"
                        >
                          Reset Form
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate("/admin-dashboard")}
                          className="action-button cancel"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="action-button primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="loading-spinner"></div>
                              Menyimpan...
                            </>
                          ) : (
                            "Simpan Buku"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Side - Book Preview */}
          <div className="preview-side">
            <div className="preview-card">
              <h3>Koleksi Buku Terkini</h3>
              <p>Daftar buku yang sudah ditambahkan</p>
              
              {/* Search and Filter */}
              <div className="preview-controls">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Cari buku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-filter"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Book Grid */}
              <div className="book-preview-grid">
                {filteredBooks.length > 0 ? (
                  filteredBooks.slice(0, 4).map((bookItem) => (
                    <div
                      key={bookItem.id}
                      className="book-preview-card"
                      onClick={() => navigate(`/books/${bookItem.id}`)}
                    >
                      <div className="book-cover-large">
                        <img
                          src={bookItem.cover?.trim() || "https://via.placeholder.com/150x200?text=No+Cover"}
                          alt={bookItem.title}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150x200?text=Error";
                          }}
                        />
                        {bookItem.rating && (
                          <div className="rating-badge">
                            ⭐ {bookItem.rating}
                          </div>
                        )}
                      </div>
                      <div className="book-details">
                        <h4 className="book-title">{bookItem.title || "Tanpa Judul"}</h4>
                        <p className="book-author">oleh {bookItem.author || "Tidak Diketahui"}</p>
                        
                        <div className="book-meta">
                          {bookItem.published && (
                            <span className="meta-item">📅 {bookItem.published}</span>
                          )}
                          {bookItem.pages && (
                            <span className="meta-item">📖 {bookItem.pages} halaman</span>
                          )}
                          {bookItem.category && (
                            <span className="meta-item category-tag">{bookItem.category}</span>
                          )}
                        </div>

                        <div className="book-description">
                          <p>
                            {bookItem.description 
                              ? (bookItem.description.length > 120 
                                  ? `${bookItem.description.substring(0, 120)}...` 
                                  : bookItem.description)
                              : "Tidak ada deskripsi tersedia untuk buku ini."
                            }
                          </p>
                        </div>

                        <div className="book-actions">
                          <button 
                            className="detail-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/books/${bookItem.id}`);
                            }}
                          >
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-books">
                    <div className="no-books-icon"></div>
                    <p>{error || "Tidak ada buku ditemukan"}</p>
                    <small>Coba ubah kata kunci pencarian atau filter kategori</small>
                  </div>
                )}
              </div>

              {filteredBooks.length > 4 && (
                <button 
                  className="view-all-button"
                  onClick={() => navigate("/admin-dashboard")}
                >
                  Lihat Semua Buku ({filteredBooks.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }