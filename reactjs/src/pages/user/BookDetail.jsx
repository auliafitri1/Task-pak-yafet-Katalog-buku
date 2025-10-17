import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./BookDetail.css";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBacaModal, setShowBacaModal] = useState(false);

  useEffect(() => {
    const fetchBookDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Anda belum login.");
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:8000/api/books/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Gagal memuat detail buku.");

        const data = await res.json();
        setBook(data);

        const allRes = await fetch(`http://localhost:8000/api/books`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allBooks = await allRes.json();

        const related = allBooks
          .filter((b) => b.category === data.category && b.id !== data.id)
          .slice(0, 4);
        setRelatedBooks(related);
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat memuat data buku.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const handleBack = () => {
    const userRole = localStorage.getItem("role");
    if (userRole === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/books');
    }
  };

  const renderStars = (rating) => {
    if (!rating) return <span className="no-rating">Belum ada rating</span>;
    return (
      <div className="stars-container">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`star ${i < Math.floor(rating) ? "filled" : ""}`}>
            ⭐
          </span>
        ))}
        <span className="rating-text">({rating})</span>
      </div>
    );
  };

  const handleBacaSekarang = () => {
    setShowBacaModal(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowBacaModal(false);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="book-detail-loading">
        <div className="loading-spinner"></div>
        <p>Memuat detail buku...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="book-not-found">
        <h2>Buku Tidak Ditemukan</h2>
        <p>{error || "Buku yang Anda cari tidak ditemukan."}</p>
        <div className="action-buttons">
          <button onClick={handleBack} className="back-btn">Kembali</button>
          <button onClick={() => navigate("/books")} className="back-btn secondary">Ke Daftar Buku</button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail">
      <div className="book-detail-container">
        <button onClick={handleBack} className="back-button">
          ← Kembali ke {localStorage.getItem("role") === "admin" ? "Dashboard" : "Daftar Buku"}
        </button>

        <div className="book-detail-content">
          <div className="book-cover-section">
            <img
              src={book.cover || "https://via.placeholder.com/300x400?text=No+Cover"}
              alt={book.title}
              onError={(e) => (e.target.src = "https://via.placeholder.com/300x400?text=Error")}
              className="book-detail-cover"
            />

            <div className="book-actions">
              <button 
                className="read-btn"
                onClick={handleBacaSekarang}
              >
                Baca Sekarang
              </button>
            </div>

            {localStorage.getItem("role") === "admin" && (
              <div className="admin-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/admin/edit-book/${book.id}`)}
                >
                  Edit Buku
                </button>
                <button
                  className="delete-btn"
                  onClick={async () => {
                    if (window.confirm("Yakin ingin menghapus buku ini?")) {
                      const token = localStorage.getItem("token");
                      try {
                        const res = await fetch(`http://localhost:8000/api/books/${book.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        if (res.ok) {
                          alert("Buku berhasil dihapus!");
                          navigate("/admin/dashboard");
                        } else {
                          alert("Gagal menghapus buku.");
                        }
                      } catch (error) {
                        alert("Terjadi kesalahan server.");
                      }
                    }
                  }}
                >
                  Hapus Buku
                </button>
              </div>
            )}
          </div>

          <div className="book-info-section">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">Oleh {book.author}</p>

            <div className="book-rating-section">
              {renderStars(book.rating)}
              <span className="reviews-count">({book.reviews || 0} reviews)</span>
            </div>

            <div className="book-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Kategori</span>
                <span className="meta-value">{book.category || "Umum"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Tahun Terbit</span>
                <span className="meta-value">{book.published_year || book.published || "Tidak diketahui"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Jumlah Halaman</span>
                <span className="meta-value">{book.pages || "Tidak diketahui"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Bahasa</span>
                <span className="meta-value">{book.language || "Indonesia"}</span>
              </div>
            </div>

            <div className="book-description-section">
              <h3>Deskripsi Buku</h3>
              <p className="book-description">
                {book.description || "Tidak ada deskripsi tersedia."}
              </p>
            </div>

            <div className="book-details-section">
              <h3>Detail Buku</h3>
              <div className="details-grid">
                <div className="detail-item"><strong>Penerbit:</strong> {book.publisher || "-"}</div>
                <div className="detail-item"><strong>ISBN:</strong> {book.isbn || "-"}</div>
                <div className="detail-item"><strong>Bahasa:</strong> {book.language || "Indonesia"}</div>
                {book.pages && <div className="detail-item"><strong>Halaman:</strong> {book.pages}</div>}
              </div>
            </div>
          </div>
        </div>

        {relatedBooks.length > 0 && (
          <section className="related-books-section">
            <h2>Buku Terkait</h2>
            <div className="related-books-grid">
              {relatedBooks.map((relatedBook) => (
                <div
                  key={relatedBook.id}
                  className="related-book-card"
                  onClick={() => navigate(`/books/${relatedBook.id}`)}
                >
                  <img
                    src={relatedBook.cover || "https://via.placeholder.com/150x200?text=No+Cover"}
                    alt={relatedBook.title}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/150x200?text=Error")}
                  />
                  <div className="related-book-info">
                    <h4>{relatedBook.title}</h4>
                    <p>{relatedBook.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ✅ MODAL CARD DESKRIPSI (SESUAI GAMBAR) */}
      {showBacaModal && (
        <div className="baca-modal-overlay" onClick={handleCloseModal}>
          <div className="baca-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>✕</button>
            <div className="card-deskripsi">
              <img
                src={book.cover || "https://via.placeholder.com/300x400?text=No+Cover"}
                alt={book.title}
                className="card-cover"
              />
              <div className="card-info">
                <h2 className="card-title">{book.title}</h2>
                <p className="card-author">Oleh {book.author}</p>
                <p className="card-category">{book.category || "Umum"}</p>
                <div className="card-rating">
                  {renderStars(book.rating)}
                  <span className="reviews-count">({book.reviews || 0} reviews)</span>
                </div>
                <div className="card-description-section">
                  <h3>Deskripsi</h3>
                  <p className="card-description">
                    {book.description || "Tidak ada deskripsi tersedia."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;