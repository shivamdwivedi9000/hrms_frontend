import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ContentHeader, Card, Avatar, LoadingSpinner } from '../components/UIElements';
import { Link } from 'react-router-dom';
import { getEmployees, getAttendance } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        attendanceToday: 0,
        departments: 0,
    });
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [empData, attendance] = await Promise.all([
                    getEmployees(),
                    getAttendance()
                ]);

                const today = new Date().toISOString().split('T')[0];
                const todayAttendance = attendance.filter(a => a.date === today && a.status === 'Present');
                const depts = new Set(empData.map(e => e.department));

                setStats({
                    totalEmployees: empData.length,
                    attendanceToday: todayAttendance.length,
                    departments: depts.size
                });

                setEmployees(empData);
                // Get last 5 attendance records
                setRecentAttendance(attendance.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
            } catch (err) {
                console.error('Failed to fetch stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const getEmployee = (id) => {
        return employees.find(e => e.id === id) || { full_name: 'Unknown', department: 'N/A' };
    };

    return (
        <Layout>
            <ContentHeader
                title="Management Overview"
                breadcrumbs={[{ label: 'Dashboard', active: true }]}
            />
            <div className="app-content">
                <div className="container-fluid">
                    {/* Stats Row */}
                    <div className="row g-4 mb-4">
                        <div className="col-lg-4 col-md-6">
                            <div className="small-box bg-primary text-white p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden shadow">
                                <div className="inner z-1">
                                    <h2 className="fw-bold mb-1">{loading ? '...' : stats.totalEmployees}</h2>
                                    <p className="opacity-75 mb-0 fw-semibold">Total Staff Members</p>
                                </div>
                                <div className="icon position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="fas fa-users fa-4x"></i>
                                </div>
                                <Link to="/employees" className="mt-3 text-white text-decoration-none small fw-bold">
                                    Manage Directory <i className="fas fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-6">
                            <div className="small-box bg-success text-white p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden shadow">
                                <div className="inner z-1">
                                    <h2 className="fw-bold mb-1">{loading ? '...' : stats.attendanceToday}</h2>
                                    <p className="opacity-75 mb-0 fw-semibold">Present Today</p>
                                </div>
                                <div className="icon position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="fas fa-calendar-check fa-4x"></i>
                                </div>
                                <Link to="/attendance" className="mt-3 text-white text-decoration-none small fw-bold">
                                    Full Attendance Log <i className="fas fa-arrow-right ms-1"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-12">
                            <div className="small-box bg-info text-white p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden shadow">
                                <div className="inner z-1">
                                    <h2 className="fw-bold mb-1">{loading ? '...' : stats.departments}</h2>
                                    <p className="opacity-75 mb-0 fw-semibold">Active Departments</p>
                                </div>
                                <div className="icon position-absolute top-0 end-0 p-3 opacity-25">
                                    <i className="fas fa-sitemap fa-4x"></i>
                                </div>
                                <div className="mt-3 small fw-bold">
                                    Optimal Efficiency
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Recent Activity Section */}
                        <div className="col-lg-8">
                            <Card title="Recent Attendance Logs" bodyPadding={false} icon="fas fa-clock">
                                {loading ? (
                                    <LoadingSpinner message="Syncing activity..." />
                                ) : recentAttendance.length === 0 ? (
                                    <div className="p-5 text-center text-muted">No recent activity detected.</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="ps-4">Employee</th>
                                                    <th>Department</th>
                                                    <th>Date</th>
                                                    <th className="text-end pe-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {recentAttendance.map(rec => {
                                                    const emp = getEmployee(rec.employee_id);
                                                    return (
                                                        <tr key={rec.id}>
                                                            <td className="ps-4">
                                                                <div className="d-flex align-items-center">
                                                                    <Avatar name={emp.full_name} size={32} />
                                                                    <span className="fw-bold text-dark">{emp.full_name}</span>
                                                                </div>
                                                            </td>
                                                            <td className="text-muted fw-medium">{emp.department}</td>
                                                            <td className="text-muted small">
                                                                {new Date(rec.date).toLocaleDateString()}
                                                            </td>
                                                            <td className="text-end pe-4">
                                                                <span className={`badge rounded-pill ${rec.status === 'Present' ? 'bg-light-success text-success border border-success' : 'bg-light-danger text-danger border border-danger'}`}>
                                                                    {rec.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Quick Actions / Info */}
                        <div className="col-lg-4">
                            <Card title="Quick Resources" icon="fas fa-bolt">
                                <div className="list-group list-group-flush">
                                    <Link to="/employees" className="list-group-item list-group-item-action border-0 px-0 d-flex align-items-center py-3">
                                        <div className="bg-light-primary rounded p-2 me-3">
                                            <i className="fas fa-user-plus text-primary"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold">Add Staff Member</div>
                                            <div className="small text-muted">Register a new employee</div>
                                        </div>
                                    </Link>
                                    <Link to="/attendance" className="list-group-item list-group-item-action border-0 px-0 d-flex align-items-center py-3">
                                        <div className="bg-light-success rounded p-2 me-3">
                                            <i className="fas fa-clipboard-list text-success"></i>
                                        </div>
                                        <div>
                                            <div className="fw-bold">Mark Attendance</div>
                                            <div className="small text-muted">Log today's presence</div>
                                        </div>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
