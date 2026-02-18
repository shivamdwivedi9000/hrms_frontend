import React from 'react';
import { Link } from 'react-router-dom';

export const ContentHeader = ({ title, breadcrumbs = [] }) => {
    return (
        <div className="app-content-header py-4">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-sm-6">
                        <h2 className="fw-bold text-dark mb-0">{title}</h2>
                    </div>
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-end mb-0 bg-transparent p-0">
                            <li className="breadcrumb-item"><Link to="/dashboard" className="text-decoration-none text-muted">Home</Link></li>
                            {breadcrumbs.map((crumb, idx) => (
                                <li key={idx} className={`breadcrumb-item ${crumb.active ? 'active fw-semibold text-primary' : ''}`}>
                                    {crumb.active ? crumb.label : <Link to={crumb.url} className="text-decoration-none text-muted">{crumb.label}</Link>}
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Card = ({ title, children, footer, type = 'primary', outline = false, bodyPadding = true, icon }) => {
    return (
        <div className={`card ${outline ? `card-${type} card-outline` : ''}`}>
            {title && (
                <div className="card-header d-flex align-items-center">
                    {icon && <i className={`${icon} me-2 text-${type}`}></i>}
                    <h3 className="card-title">{title}</h3>
                </div>
            )}
            <div className={`card-body ${!bodyPadding ? 'p-0' : ''}`}>
                {children}
            </div>
            {footer && (
                <div className="card-footer bg-white border-top-0">
                    {footer}
                </div>
            )}
        </div>
    );
};

export const Avatar = ({ name, size = 40 }) => {
    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?';
    return (
        <div className="avatar-circle" style={{ width: size, height: size, minWidth: size }}>
            {initials}
        </div>
    );
};

export const LoadingSpinner = ({ message = 'Loading...' }) => (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
        <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <div className="text-muted fw-medium">{message}</div>
    </div>
);

export const EmptyState = ({ icon = 'fas fa-folder-open', title = 'No Data Found', message }) => (
    <div className="text-center p-5">
        <div className="mb-3">
            <i className={`${icon} fa-4x text-light`}></i>
        </div>
        <h4 className="text-dark fw-bold mb-2">{title}</h4>
        {message && <p className="text-muted mb-0">{message}</p>}
    </div>
);

export const ErrorState = ({ message = 'Something went wrong', onRetry }) => (
    <div className="alert alert-danger m-3 d-flex align-items-center justify-content-between border-0 shadow-sm rounded-3">
        <div>
            <i className="fas fa-exclamation-circle me-2"></i>
            <span className="fw-medium">{message}</span>
        </div>
        {onRetry && (
            <button className="btn btn-danger btn-sm px-3" onClick={onRetry}>
                Retry
            </button>
        )}
    </div>
);

export const ConfirmationModal = ({ show, onHide, onConfirm, title = 'Confirm Action', body, type = 'danger' }) => {
    if (!show) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold text-dark">
                            {title}
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body py-4">
                        <div className="d-flex align-items-center">
                            <div className={`bg-light-${type} rounded-circle p-3 me-3 d-flex align-items-center justify-content-center`} style={{ width: '60px', height: '60px' }}>
                                <i className={`fas fa-exclamation-triangle fa-2x text-${type}`}></i>
                            </div>
                            <p className="mb-0 text-secondary fs-6 fw-medium">{body}</p>
                        </div>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                        <button type="button" className="btn btn-light px-4 border" onClick={onHide}>Cancel</button>
                        <button type="button" className={`btn btn-${type} px-4`} onClick={onConfirm}>
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
