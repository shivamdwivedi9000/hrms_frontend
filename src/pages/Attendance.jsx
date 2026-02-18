import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ContentHeader, Card, LoadingSpinner, EmptyState, ErrorState, Avatar } from '../components/UIElements';
import { getEmployees, getAttendance, markAttendance } from '../services/api';
import { toast } from 'react-toastify';

const Attendance = () => {
    const [employees, setEmployees] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState('all');
    const [employeeSearch, setEmployeeSearch] = useState('');
    const [historySearch, setHistorySearch] = useState('');
    const [formData, setFormData] = useState({
        employee_id: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [empData, attData] = await Promise.all([
                getEmployees(),
                getAttendance()
            ]);
            setEmployees(empData);
            setAttendanceRecords(attData);
            setError(null);
        } catch (err) {
            setError('Failed to load attendance data.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await markAttendance({
                ...formData,
                employee_id: parseInt(formData.employee_id)
            });
            toast.success('Attendance recorded!');
            fetchData();
            setFormData({ ...formData, employee_id: '' });
        } catch (err) {
            toast.error('Failed to mark attendance');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEmployeesForSelect = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(employeeSearch.toLowerCase())
    );

    const getEmployee = (id) => {
        return employees.find(e => e.id === id) || { full_name: 'Unknown', department: '' };
    };

    const filteredRecords = attendanceRecords.filter(rec => {
        const emp = getEmployee(rec.employee_id);
        const matchesEmployee = selectedEmployee === 'all' || rec.employee_id === parseInt(selectedEmployee);
        const matchesSearch = emp.full_name.toLowerCase().includes(historySearch.toLowerCase()) ||
            emp.employee_id.toLowerCase().includes(historySearch.toLowerCase());
        return matchesEmployee && matchesSearch;
    });

    return (
        <Layout>
            <ContentHeader
                title="Attendance Tracker"
                breadcrumbs={[{ label: 'Attendance', active: true }]}
            />
            <div className="app-content">
                <div className="container-fluid">
                    <div className="row g-4">
                        {/* Mark Attendance Form */}
                        <div className="col-md-4">
                            <Card title="Mark Daily Status" type="success" icon="fas fa-calendar-check" outline>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-uppercase text-muted">Select Staff Member</label>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted small"></i></span>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm border-start-0"
                                                placeholder="Filter staff list..."
                                                value={employeeSearch}
                                                onChange={(e) => setEmployeeSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="fas fa-user text-muted"></i></span>
                                            <select name="employee_id" className="form-select bg-light" value={formData.employee_id} onChange={handleChange} required>
                                                <option value="">-- {filteredEmployeesForSelect.length} staff found --</option>
                                                {filteredEmployeesForSelect.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_id})</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold small text-uppercase text-muted">Log Date</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="fas fa-clock text-muted"></i></span>
                                            <input type="date" name="date" className="form-control bg-light" value={formData.date} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold small text-uppercase text-muted">Presence Status</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><i className="fas fa-check-double text-muted"></i></span>
                                            <select name="status" className="form-select bg-light" value={formData.status} onChange={handleChange} required>
                                                <option value="Present">Present</option>
                                                <option value="Absent">Absent</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100 py-2 shadow-sm" disabled={submitting || employees.length === 0}>
                                        {submitting ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                                        ) : (
                                            <><i className="fas fa-save me-2"></i>Save Attendance</>
                                        )}
                                    </button>
                                </form>
                            </Card>
                        </div>

                        {/* Attendance Records List */}
                        <div className="col-md-8">
                            <Card
                                title="Attendance History"
                                bodyPadding={false}
                                icon="fas fa-history"
                                header={
                                    <div className="d-flex align-items-center justify-content-between w-100 pe-3 py-1">
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-history me-2 text-primary"></i>
                                            <h5 className="mb-0 fw-bold text-dark">Attendance History</h5>
                                        </div>
                                        <div className="input-group input-group-sm w-auto shadow-sm">
                                            <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted small"></i></span>
                                            <input
                                                type="text"
                                                className="form-control border-start-0 ps-0"
                                                placeholder="Search history..."
                                                value={historySearch}
                                                onChange={(e) => setHistorySearch(e.target.value)}
                                                style={{ maxWidth: '200px' }}
                                            />
                                        </div>
                                    </div>
                                }
                                footer={
                                    <div className="d-flex align-items-center justify-content-between w-100">
                                        <span className="text-muted small fw-medium">Showing {filteredRecords.length} records</span>
                                        <div className="d-flex align-items-center">
                                            <span className="me-2 text-muted small fw-bold text-uppercase">Role Filter:</span>
                                            <select
                                                className="form-select form-select-sm w-auto border-0 bg-light fw-semibold"
                                                value={selectedEmployee}
                                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                            >
                                                <option value="all">Every Member</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                }
                            >
                                {error && <ErrorState message={error} onRetry={fetchData} />}
                                {loading ? (
                                    <LoadingSpinner message="Retrieving attendance logs..." />
                                ) : filteredRecords.length === 0 ? (
                                    <EmptyState message="No attendance data matches your current filters." />
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="ps-4">Staff Member</th>
                                                    <th>Date</th>
                                                    <th className="text-end pe-4">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRecords.map(rec => {
                                                    const emp = getEmployee(rec.employee_id);
                                                    return (
                                                        <tr key={rec.id}>
                                                            <td className="ps-4">
                                                                <div className="d-flex align-items-center">
                                                                    <Avatar name={emp.full_name} size={32} />
                                                                    <div>
                                                                        <div className="fw-bold text-dark">{emp.full_name}</div>
                                                                        <div className="small text-muted">{emp.department}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-muted fw-medium">
                                                                <i className="far fa-calendar-alt me-2 text-primary"></i>
                                                                {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </td>
                                                            <td className="text-end pe-4">
                                                                <span className={`badge rounded-pill px-3 py-2 ${rec.status === 'Present' ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                                                                    <i className={`fas ${rec.status === 'Present' ? 'fa-check' : 'fa-times'} me-1`}></i>
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
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Attendance;
