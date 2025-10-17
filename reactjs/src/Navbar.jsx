import './Navbar.css';
import { useNavigate } from "react-router-dom";

function Navbar() {
    const role = localStorage.getItem("role");
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login-modern");
  };


    if (role !== "user") {
        return (
            <div>
                <nav className="navbar">
                    <div className="nav-logo">EduBooks</div>
                    <div className='nav-links'>
                        <span className="link" onClick={() => navigate("/")}>Home</span>
                        <span className="link" onClick={() => navigate("/admin/add-book")}>AddBooks</span>
                        <span className="link" onClick={() => navigate("/books")}>Books</span>
                        <span className="link" onClick={() => navigate("/about")}>About</span>
                       
                        <button onClick={handleLogout} className="btn-logout">Logout</button>
                    </div>
                </nav>
            </div>
        );
    }
    return (
        <div>
            <nav className="navbar">
                <div className="nav-logo">EduBooks</div>
                <div className="nav-links">
                    <span className="link" onClick={() => navigate("/")}>Home</span>
                    <span className="link" onClick={() => navigate("/books")}>Books</span>
                    <span className="link" onClick={() => navigate("/about")}>About</span>
                
                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                </div>
            </nav>
        </div>

    );
}

export default Navbar;