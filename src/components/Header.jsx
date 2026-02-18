import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="app-header navbar navbar-expand bg-body">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                            <i className="fas fa-bars"></i>
                        </a>
                    </li>
                    <li className="nav-item d-none d-md-block">
                        <Link to="/dashboard" className="nav-link">Home</Link>
                    </li>
                </ul>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <button className="nav-link btn btn-link text-decoration-none text-muted" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt me-1"></i> Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
