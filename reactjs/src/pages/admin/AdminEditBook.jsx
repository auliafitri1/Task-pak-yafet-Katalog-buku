import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AdminEdit.css";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    publisher: "",
    published_year: "",
    pages: "",
    rating: "",
    language: "",
    cover: "",
    description: "",
    isbn: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const categories = [
    "Fiksi", "Non-Fiksi", "Sains", "Teknologi", "Sejarah", 
    "Biografi", "Fantasi", "Romance", "Misteri", "Pendidikan",
    "Bisnis", "Kesehatan", "Seni", "Olahraga", "Travel", "Agama",
    "Komik", "Anak", "Remaja", "Kuliner", "Self-Help", "Hukum"
  ];

  const languages = ["Indonesia", "English", "Jawa", "Sunda", "Arab", "Mandarin", "Other"];

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Anda belum login.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8000/api/books/${id}`, {
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat data buku.");
        }

        const bookData = await response.json();
        console.log("Book data from API:", bookData);
        
        // Format data untuk form sesuai struktur yang diminta
        setBook({
          title: bookData.title || "",
          author: bookData.author || "",
          category: bookData.category || "",
          publisher: bookData.publisher || "",
          published_year: bookData.published_year || "",
          pages: bookData.pages || "",
          rating: bookData.rating || "",
          language: bookData.language || "Indonesia",
          cover: bookData.cover || "",
          description: bookData.description || "",
          isbn: bookData.isbn || ""
        });

      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda belum login.");
      }

      // Validasi data wajib
      if (!book.title || !book.author) {
        throw new Error("Judul dan penulis harus diisi");
      }

      // Format data untuk API
      const bookData = {
        title: book.title,
        author: book.author,
        category: book.category,
        publisher: book.publisher,
        published_year: book.published_year ? parseInt(book.published_year) : null,
        pages: book.pages ? parseInt(book.pages) : null,
        rating: book.rating ? parseFloat(book.rating) : null,
        language: book.language,
        cover: book.cover,
        description: book.description,
        isbn: book.isbn
      };

      // Hapus field yang null atau empty
      Object.keys(bookData).forEach(key => {
        if (bookData[key] === null || bookData[key] === "" || bookData[key] === undefined) {
          delete bookData[key];
        }
      });

      console.log("Sending data to API:", bookData);

      const response = await fetch(`http://localhost:8000/api/books/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(bookData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Gagal menyimpan perubahan. Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Book updated successfully:", result);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate(`/books/${id}`);
      }, 2000);

    } catch (err) {
      console.error("Error updating book:", err);
      setError(err.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/books/${id}`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file maksimal 5MB");
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setBook(prev => ({ ...prev, cover: imageUrl }));
    }
  };

  // PERBAIKAN: Loading state yang konsisten
  if (loading) {
    return (
      <div className="edit-book-page">
        <div className="edit-header">
          <div className="header-content">
            <button onClick={handleCancel} className="back-btn"> {/* GUNAKAN handleCancel */}
              <span className="back-arrow">←</span>
              Kembali
            </button>
            <div className="header-title">
              <h1>Edit Buku</h1>
              <p>Memuat data buku...</p>
            </div>
          </div>
        </div>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Sedang memuat data buku...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-book-page">
      {/* Header */}
      <div className="edit-header">
        <div className="header-content">
          <button onClick={handleCancel} className="back-btn">
            <span className="back-arrow">←</span>
            Kembali ke Detail
          </button>
          <div className="header-title">
            <h1>Edit Buku: {book.title}</h1>
            <p>Perbarui informasi buku dengan data yang sudah ada</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="section-navigation">
        <div className="nav-container">
          <button 
            className={`nav-btn ${activeSection === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveSection('basic')}
          >
             Informasi Dasar
          </button>
          <button 
            className={`nav-btn ${activeSection === 'details' ? 'active' : ''}`}
            onClick={() => setActiveSection('details')}
          >
             Detail Buku
          </button>
          <button 
            className={`nav-btn ${activeSection === 'cover' ? 'active' : ''}`}
            onClick={() => setActiveSection('cover')}
          >
             Cover & Deskripsi
          </button>
          <button 
            className={`nav-btn ${activeSection === 'additional' ? 'active' : ''}`}
            onClick={() => setActiveSection('additional')}
          >
             Informasi Tambahan
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="notifications-container">
        {error && (
          <div className="notification error">
            <div className="notification-icon">⚠️</div>
            <div className="notification-text">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        {success && (
          <div className="notification success">
            <div className="notification-icon">✅</div>
            <div className="notification-text">
              <strong>Berhasil!</strong>
              <p>Perubahan berhasil disimpan.</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="edit-content">
        <form onSubmit={handleSubmit} className="edit-form">
          
          {/* Section 1: Informasi Dasar */}
          {activeSection === 'basic' && (
            <div className="form-section active">
              <div className="section-header">
                <h3>Informasi Dasar Buku</h3>
                <p>Data utama yang mengidentifikasi buku</p>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Judul Buku *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={book.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan judul buku"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="author">Penulis *</label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={book.author}
                    onChange={handleInputChange}
                    required
                    placeholder="Nama penulis"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="category">Kategori</label>
                  <select
                    id="category"
                    name="category"
                    value={book.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="publisher">Penerbit</label>
                  <input
                    type="text"
                    id="publisher"
                    name="publisher"
                    value={book.publisher}
                    onChange={handleInputChange}
                    placeholder="Nama penerbit"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Detail Buku */}
          {activeSection === 'details' && (
            <div className="form-section active">
              <div className="section-header">
                <h3>Detail Buku</h3>
                <p>Informasi spesifikasi dan publikasi buku</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="published_year">Tahun Terbit</label>
                  <input
                    type="number"
                    id="published_year"
                    name="published_year"
                    value={book.published_year}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    min="1000"
                    max="2024"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="pages">Jumlah Halaman</label>
                  <input
                    type="number"
                    id="pages"
                    name="pages"
                    value={book.pages}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="1"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={book.rating}
                    onChange={handleInputChange}
                    placeholder="0-5"
                    min="0"
                    max="5"
                    step="0.1"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="language">Bahasa</label>
                  <select
                    id="language"
                    name="language"
                    value={book.language}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="">Pilih Bahasa</option>
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Cover & Deskripsi */}
          {activeSection === 'cover' && (
            <div className="form-section active">
              <div className="section-header">
                <h3>Cover & Deskripsi</h3>
                <p>Gambar cover dan deskripsi lengkap buku</p>
              </div>

              <div className="cover-description-grid">
                <div className="cover-section">
                  <div className="form-group">
                    <label htmlFor="cover">URL Cover Buku</label>
                    <input
                      type="url"
                      id="cover"
                      name="cover"
                      value={book.cover}
                      onChange={handleInputChange}
                      placeholder="https://example.com/cover.jpg"
                      className="form-input"
                    />
                  </div>

                  <div className="cover-preview">
                    <div className="preview-label">Preview Cover</div>
                    <img
                      src={book.cover || "https://via.placeholder.com/200x300?text=No+Cover"}
                      alt="Preview cover"
                      className="cover-image-preview"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x300?text=Error+Loading";
                      }}
                    />
                    <div className="upload-option">
                      <label className="file-upload-btn">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                         Upload Gambar
                      </label>
                      <small>Format: JPG, PNG, WEBP (max 5MB)</small>
                    </div>
                  </div>
                </div>

                <div className="description-section">
                  <div className="form-group">
                    <label htmlFor="description">Deskripsi Buku</label>
                    <textarea
                      id="description"
                      name="description"
                      value={book.description}
                      onChange={handleInputChange}
                      rows="12"
                      placeholder="Tulis deskripsi buku yang menarik dan informatif..."
                      className="form-textarea"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Informasi Tambahan */}
          {activeSection === 'additional' && (
            <div className="form-section active">
              <div className="section-header">
                <h3>Informasi Tambahan</h3>
                <p>Data identifikasi tambahan buku</p>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={book.isbn}
                    onChange={handleInputChange}
                    placeholder="Masukkan nomor ISBN"
                    className="form-input"
                  />
                  <small className="input-help">
                    International Standard Book Number - identifikasi unik untuk buku
                  </small>
                </div>
              </div>

              {/* Data Preview */}
              <div className="preview-section">
                <h4>Preview Data Buku</h4>
                <div className="preview-grid">
                  <div className="preview-item">
                    <strong>Judul:</strong> {book.title || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>Penulis:</strong> {book.author || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>Kategori:</strong> {book.category || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>Penerbit:</strong> {book.publisher || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>Tahun Terbit:</strong> {book.published_year || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>Rating:</strong> {book.rating || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>Bahasa:</strong> {book.language || "-"}
                  </div>
                  <div className="preview-item">
                    <strong>ISBN:</strong> {book.isbn || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="section-navigation-buttons">
            <div className="nav-buttons">
              {activeSection !== 'basic' && (
                <button 
                  type="button"
                  className="nav-prev-btn"
                  onClick={() => {
                    const sections = ['basic', 'details', 'cover', 'additional'];
                    const currentIndex = sections.indexOf(activeSection);
                    setActiveSection(sections[currentIndex - 1]);
                  }}
                >
                  ← Sebelumnya
                </button>
              )}
              
              {activeSection !== 'additional' && (
                <button 
                  type="button"
                  className="nav-next-btn"
                  onClick={() => {
                    const sections = ['basic', 'details', 'cover', 'additional'];
                    const currentIndex = sections.indexOf(activeSection);
                    setActiveSection(sections[currentIndex + 1]);
                  }}
                >
                  Selanjutnya →
                </button>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <div className="form-actions-content">
              <button
                type="button"
                onClick={handleCancel}
                className="cancel-btn"
                disabled={saving}
              >
                Batal
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="btn-spinner"></div>
                    Menyimpan...
                  </>
                ) : (
                  " Simpan Perubahan"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;




// import React, { useState, useEffect, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./AdminDashboard.css";
// import Navbar from "../../Navbar";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [books, setBooks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const carouselRef = useRef(null);

//   // 🔹 Fungsi scroll geser kiri/kanan
//   const scrollLeft = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
//     }
//   };

//   const scrollRight = () => {
//     if (carouselRef.current) {
//       carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
//     }
//   };

//   // 🔹 Ambil data buku
//   useEffect(() => {
//     const fetchBooks = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) throw new Error("Token tidak ditemukan. Silakan login ulang.");

//         const res = await fetch("http://localhost:8000/api/books", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!res.ok) throw new Error(`Gagal memuat buku (${res.status})`);

//         const data = await res.json();
//         setBooks(Array.isArray(data) ? data : []);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBooks();
//   }, []);

//   const categories = ["All", ...new Set(books.map((b) => b.category).filter(Boolean))];

//   const filteredBooks = books
//     .filter((b) => (selectedCategory === "All" ? true : b.category === selectedCategory))
//     .filter(
//       (b) =>
//         (b.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (b.author || "").toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   const renderStars = (rating = 0) => {
//     const r = Math.floor(Number(rating) || 0);
//     return <span className="book-rating">{"★".repeat(Math.max(0, Math.min(5, r)))}</span>;
//   };

//   if (loading) return <div className="dashboard"><h2>Memuat daftar buku...</h2></div>;
//   if (error)
//     return (
//       <div className="dashboard" style={{ color: "red", textAlign: "center", padding: "50px" }}>
//         <h3>❌ Error</h3>
//         <p>{error}</p>
//         <button onClick={() => window.location.reload()}>Coba Lagi</button>
//       </div>
//     );

//   return (
//     <div className="dashboard">
//       <Navbar />

      // {/* ================= Header Shopee Style ================= */}
      // <header className="shopee-header">
      //   <div className="header-top">
      //     <div className="header-title">
      //       <h1>Shopee Pilih Lokal</h1>
      //       <p>Temukan Bimbingan Product Level No. 1</p>
      //     </div>
      //     <div className="header-actions">
      //       <button className="notification-btn">🔔</button>
      //       <button className="cart-btn">🛒</button>
      //     </div>
      //   </div>
        
      //   <div className="discount-banner">
      //     <span className="discount-badge">DISKON 15%</span>
      //     <span className="discount-text">Shopee Pilih 100% OR!</span>
      //   </div>
      // </header>

      // <main className="content">
      //   {/* ================= Quick Actions ================= */}
      //   <section className="quick-actions">
      //     <div className="action-buttons">
      //       <button className="action-btn active">Pilih</button>
      //       <button className="action-btn">Sweet 50%</button>
      //     </div>
      //   </section>

      //   {/* ================= Product Stats ================= */}
      //   <section className="product-stats">
      //     <div className="stat-grid">
      //       <div className="stat-item">
      //         <span className="stat-label">Buyout (10)</span>
      //         <span className="stat-value">Total</span>
      //       </div>
      //       <div className="stat-item">
      //         <span className="stat-label">Shares total</span>
      //         <span className="stat-value">Price 100%</span>
      //       </div>
      //       <div className="stat-item">
      //         <span className="stat-label">Fresh Sale</span>
      //         <span className="stat-value">A$5000</span>
      //       </div>
      //       <div className="stat-item">
      //         <span className="stat-label">Sales/Return</span>
      //         <span className="stat-value">Hold 100%</span>
      //       </div>
      //       <div className="stat-item">
      //         <span className="stat-label">Buyout 200%</span>
      //         <span className="stat-value">Shares for sale</span>
      //       </div>
      //       <div className="stat-item">
      //         <span className="stat-label">Bonus from</span>
      //         <span className="stat-value">-</span>
      //       </div>
      //     </div>
      //   </section>

//         {/* ================= Populer Section ================= */}
//         <section className="populer-section">
//           <h2 className="populer-title">🔥 Produk Populer</h2>
//           <div className="populer-carousel-container">
//             <button className="carousel-arrow left" onClick={scrollLeft}>
//               ‹
//             </button>

//             <div className="populer-layout" ref={carouselRef}>
//               {filteredBooks.slice(0, 8).map((book) => (
//                 <div key={book.id} className="populer-card">
//                   <div className="populer-image">
//                     <img
//                       src={book.cover || "https://via.placeholder.com/150x150?text=No+Cover"}
//                       alt={book.title}
//                       className="populer-cover"
//                     />
//                     <div className="populer-badge">Hot</div>
//                   </div>
//                   <div className="populer-info">
//                     <h4 className="populer-book-title">{book.title}</h4>
//                     <div className="populer-price">
//                       <span className="current-price">Rp {(book.price || 45000).toLocaleString()}</span>
//                     </div>
//                     <div className="populer-meta">
//                       <span className="rating">
//                         {renderStars(book.rating)}
//                         <span>({book.rating || 0})</span>
//                       </span>
//                       <span className="sold">Terjual {book.sold || Math.floor(Math.random() * 50) + 10}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="carousel-arrow right" onClick={scrollRight}>
//               ›
//             </button>
//           </div>
//         </section>



/* ================= AdminDashboard.css - Shopee Style ================= */

/* Reset dan Base Styles */
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }

// body {
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//   color: #333;
//   line-height: 1.6;
//   min-height: 100vh;
//   background: #f5f5f5;
// }

// /* ================= Container Utama ================= */
// .dashboard {
//   min-height: 100vh;
//   background: #f5f5f5;
// }

// /* ================= Header Shopee Style ================= */
// .shopee-header {
//   background: linear-gradient(135deg, #ee4d2d, #ff7337);
//   color: white;
//   padding: 15px 0;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// }

// .header-top {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 0 15px;
// }

// .header-title h1 {
//   font-size: 1.4rem;
//   font-weight: 700;
//   margin-bottom: 4px;
// }

// .header-title p {
//   font-size: 0.8rem;
//   opacity: 0.9;
// }

// .header-actions {
//   display: flex;
//   gap: 10px;
// }

// .notification-btn, .cart-btn {
//   background: rgba(255, 255, 255, 0.2);
//   border: none;
//   color: white;
//   padding: 8px;
//   border-radius: 50%;
//   cursor: pointer;
//   font-size: 1.1rem;
//   transition: background 0.3s ease;
// }

// .notification-btn:hover, .cart-btn:hover {
//   background: rgba(255, 255, 255, 0.3);
// }

// .discount-banner {
//   background: rgba(255, 255, 255, 0.15);
//   padding: 8px 15px;
//   margin-top: 10px;
//   display: flex;
//   align-items: center;
//   gap: 10px;
//   font-size: 0.8rem;
// }

// .discount-badge {
//   background: #ffd700;
//   color: #ee4d2d;
//   padding: 2px 8px;
//   border-radius: 12px;
//   font-weight: 700;
//   font-size: 0.7rem;
// }

// .discount-text {
//   font-weight: 600;
// }

// /* ================= Main Content ================= */
// .content {
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 15px;
// }

// /* ================= Quick Actions ================= */
// .quick-actions {
//   margin-bottom: 15px;
// }

// .action-buttons {
//   display: flex;
//   gap: 10px;
// }

// .action-btn {
//   background: white;
//   border: 1px solid #ddd;
//   padding: 8px 16px;
//   border-radius: 20px;
//   font-size: 0.8rem;
//   cursor: pointer;
//   transition: all 0.3s ease;
// }

// .action-btn.active {
//   background: #ee4d2d;
//   color: white;
//   border-color: #ee4d2d;
// }

// .action-btn:hover {
//   border-color: #ee4d2d;
// }

// /* ================= Product Stats ================= */
// .product-stats {
//   background: white;
//   border-radius: 10px;
//   padding: 15px;
//   margin-bottom: 20px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
// }

// .stat-grid {
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 15px;
// }

// .stat-item {
//   text-align: center;
//   padding: 10px;
//   border-right: 1px solid #f0f0f0;
// }

// .stat-item:last-child {
//   border-right: none;
// }

// .stat-label {
//   display: block;
//   font-size: 0.75rem;
//   color: #666;
//   margin-bottom: 5px;
// }

// .stat-value {
//   display: block;
//   font-size: 0.9rem;
//   font-weight: 600;
//   color: #ee4d2d;
// }

// /* ================= Populer Section ================= */
// .populer-section {
//   background: white;
//   border-radius: 12px;
//   padding: 20px;
//   margin: 20px 0;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
// }

// .populer-title {
//   font-size: 1.3rem;
//   font-weight: 700;
//   color: #ee4d2d;
//   margin-bottom: 15px;
// }

// .populer-carousel-container {
//   position: relative;
//   width: 100%;
//   overflow: hidden;
// }

// .populer-layout {
//   display: flex;
//   gap: 15px;
//   overflow-x: auto;
//   scroll-behavior: smooth;
//   padding: 10px 5px;
//   scrollbar-width: none;
// }

// .populer-layout::-webkit-scrollbar {
//   display: none;
// }

// .populer-card {
//   flex: 0 0 auto;
//   width: 160px;
//   background: #f8f9fa;
//   border-radius: 10px;
//   padding: 12px;
//   transition: all 0.3s ease;
//   border: 1px solid #f0f0f0;
// }

// .populer-card:hover {
//   transform: translateY(-2px);
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
// }

// .populer-image {
//   position: relative;
//   height: 120px;
//   margin-bottom: 10px;
// }

// .populer-cover {
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   border-radius: 6px;
// }

// .populer-badge {
//   position: absolute;
//   top: 5px;
//   left: 5px;
//   background: #ee4d2d;
//   color: white;
//   padding: 2px 6px;
//   border-radius: 10px;
//   font-size: 0.6rem;
//   font-weight: 700;
// }

// .populer-info {
//   text-align: center;
// }

// .populer-book-title {
//   font-size: 0.8rem;
//   font-weight: 600;
//   margin-bottom: 6px;
//   line-height: 1.2;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   height: 2.4em;
// }

// .populer-price {
//   margin-bottom: 6px;
// }

// .populer-price .current-price {
//   font-size: 0.9rem;
//   font-weight: 700;
//   color: #ee4d2d;
// }

// .populer-meta {
//   display: flex;
//   flex-direction: column;
//   gap: 3px;
//   font-size: 0.7rem;
//   color: #666;
// }

// .carousel-arrow {
//   position: absolute;
//   top: 50%;
//   transform: translateY(-50%);
//   background: white;
//   border: 1px solid #ddd;
//   border-radius: 50%;
//   width: 32px;
//   height: 32px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   cursor: pointer;
//   font-size: 1rem;
//   font-weight: bold;
//   color: #ee4d2d;
//   box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//   transition: all 0.3s ease;
//   z-index: 10;
// }

// .carousel-arrow:hover {
//   background: #ee4d2d;
//   color: white;
//   border-color: #ee4d2d;
// }

// .carousel-arrow.left {
//   left: -15px;
// }

// .carousel-arrow.right {
//   right: -15px;
// }