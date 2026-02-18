import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="app-wrapper">
            <Header />
            <Sidebar />
            <main className="app-main">
                {children}
            </main>
            <footer className="app-footer">
                <div className="float-end d-none d-sm-inline">
                    Version 1.0.0
                </div>
                <strong>
                    Copyright &copy; 2024&nbsp;
                    <a href="https://adminlte.io" className="text-decoration-none">HRMS Admin</a>.
                </strong>
                All rights reserved.
            </footer>
        </div>
    );
};

export default Layout;
