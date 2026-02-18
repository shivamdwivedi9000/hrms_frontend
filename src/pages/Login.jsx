import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = 'login-page';
        document.body.style.background = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';
        document.body.style.minHeight = '100vh';
        return () => {
            document.body.className = 'layout-fixed sidebar-expand-lg bg-body-tertiary';
            document.body.style.background = '';
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(username, password);
            toast.success('Access Granted! Welcome back.');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            const errorMessage = err.response?.data?.detail || err.message || 'Connection failed. Please try again.';
            toast.error(errorMessage === 'Incorrect username or password' ? 'Invalid credentials. Please try again.' : `Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-box" style={{ animation: 'fadeIn 0.6s ease-out' }}>
            <div className="text-center mb-4">
                <div className="display-6 fw-bold text-white mb-2">
                    <span className="text-primary"><i className="fas fa-microchip me-2"></i></span>
                    HR<span className="text-primary">MS</span>
                </div>
                <div className="text-muted small text-uppercase letter-spacing-1 fw-bold">Enterprise Administration</div>
            </div>

            <div className="card shadow-lg border-0" style={{ borderRadius: '1rem' }}>
                <div className="card-body p-4 p-md-5">
                    <h4 className="fw-bold text-dark mb-1">Welcome back</h4>
                    <p className="text-muted small mb-4">Please enter your credentials to continue</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-uppercase text-muted">Username</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0"><i className="fas fa-user text-muted"></i></span>
                                <input
                                    type="text"
                                    className="form-control bg-light border-start-0 py-2"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Password</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0"><i className="fas fa-lock text-muted"></i></span>
                                <input
                                    type="password"
                                    className="form-control bg-light border-start-0 py-2"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary py-2 fw-bold shadow-sm" disabled={loading}>
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Authenticating...</>
                                ) : (
                                    'Secure Login'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="card-footer bg-light border-0 py-3 text-center rounded-bottom">
                    <small className="text-muted">Protected by Enterprise Grade Security</small>
                </div>
            </div>
        </div>
    );
};

export default Login;
