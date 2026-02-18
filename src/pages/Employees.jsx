import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { ContentHeader, Card, LoadingSpinner, EmptyState, ErrorState, ConfirmationModal, Avatar } from '../components/UIElements';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';
import { toast } from 'react-toastify';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        employee_id: '',
        full_name: '',
        email: '',
        department: ''
    });

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await getEmployees();
            setEmployees(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch employees. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createEmployee(formData);
            toast.success('Employee added successfully!');
            setFormData({ employee_id: '', full_name: '', email: '', department: '' });
            fetchEmployees();
        } catch (err) {
            const detail = err.response?.data?.detail || 'Failed to add employee';
            toast.error(detail);
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteEmployee(deleteId);
            toast.success('Employee deleted successfully!');
            fetchEmployees();
        } catch (err) {
            toast.error('Failed to delete employee');
        } finally {
            setShowDeleteModal(false);
            setDeleteId(null);
        }
    };

    const getDeptIcon = (dept) => {
        const d = dept.toLowerCase();
        if (d.includes('it') || d.includes('tech') || d.includes('software')) return 'fa-laptop-code';
        if (d.includes('sales') || d.includes('marketing')) return 'fa-chart-line';
        if (d.includes('hr')) return 'fa-users-cog';
        if (d.includes('finance')) return 'fa-file-invoice-dollar';
        return 'fa-briefcase';
    };

    const filteredEmployees = employees.filter(emp =>
        emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <ContentHeader
                title="Employee Directory"
                breadcrumbs={[{ label: 'Employees', active: true }]}
            />
            <div className="app-content">
                <div className="container-fluid">
                    <Card title="Add New Employee" type="primary" icon="fas fa-user-plus" outline>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold small text-uppercase text-muted">Employee ID</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="fas fa-id-badge text-muted"></i></span>
                                        <input type="text" name="employee_id" className="form-control bg-light border-start-0" placeholder="e.g. EMP001" value={formData.employee_id} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold small text-uppercase text-muted">Full Name</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="fas fa-user text-muted"></i></span>
                                        <input type="text" name="full_name" className="form-control bg-light border-start-0" placeholder="John Doe" value={formData.full_name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold small text-uppercase text-muted">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="fas fa-envelope text-muted"></i></span>
                                        <input type="email" name="email" className="form-control bg-light border-start-0" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold small text-uppercase text-muted">Department</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="fas fa-building text-muted"></i></span>
                                        <input type="text" name="department" className="form-control bg-light border-start-0" placeholder="IT, Sales, etc." value={formData.department} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary px-4 py-2 shadow-sm" disabled={submitting}>
                                    {submitting ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Adding...</>
                                    ) : (
                                        <><i className="fas fa-plus-circle me-2"></i>Register Employee</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </Card>

                    <Card
                        title="Management List"
                        bodyPadding={false}
                        icon="fas fa-list-ul"
                        header={
                            <div className="d-flex align-items-center justify-content-between w-100 pe-3">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-list-ul me-2 text-primary"></i>
                                    <h5 className="mb-0 fw-bold text-dark">Management List</h5>
                                </div>
                                <div className="input-group input-group-sm w-auto shadow-sm">
                                    <span className="input-group-text bg-white border-end-0"><i className="fas fa-search text-muted small"></i></span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search directory..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        style={{ maxWidth: '250px' }}
                                    />
                                    {searchQuery && (
                                        <button className="btn btn-white border border-start-0 text-muted" onClick={() => setSearchQuery('')}>
                                            <i className="fas fa-times small"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                        }
                    >
                        {error && <ErrorState message={error} onRetry={fetchEmployees} />}
                        {loading ? (
                            <LoadingSpinner message="Organizing employee records..." />
                        ) : filteredEmployees.length === 0 ? (
                            <EmptyState message={searchQuery ? "No employees found matching your search." : "No employees registered yet. Use the form above to get started."} icon={searchQuery ? "fas fa-search" : "fas fa-users-slash"} />
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 sticky-header">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="ps-4">Employee</th>
                                            <th>Employee ID</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th className="text-end pe-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees.map((emp) => (
                                            <tr key={emp.id} className="align-middle">
                                                <td className="ps-4 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <Avatar name={emp.full_name} />
                                                        <div className="ms-3">
                                                            <div className="fw-bold text-dark">{emp.full_name}</div>
                                                            <div className="small text-muted">Active Member</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-primary border px-2 py-1 fw-bold">
                                                        <i className="fas fa-hashtag me-1 opacity-50"></i>{emp.employee_id}
                                                    </span>
                                                </td>
                                                <td className="text-muted fw-medium small">{emp.email}</td>
                                                <td>
                                                    <span className="text-dark fw-bold small text-uppercase">
                                                        <i className={`fas ${getDeptIcon(emp.department)} me-2 text-primary opacity-75`}></i>
                                                        {emp.department}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-light btn-sm border-0 rounded-circle"
                                                            style={{ width: '32px', height: '32px' }}
                                                            onClick={() => openDeleteModal(emp.id)}
                                                            title="Delete Employee"
                                                        >
                                                            <i className="fas fa-trash-alt text-danger small"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>

                    <ConfirmationModal
                        show={showDeleteModal}
                        onHide={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        title="Delete Employee"
                        body={`This will permanently remove ${employees.find(e => e.id === deleteId)?.full_name || 'the employee'} and all associated attendance history. This action cannot be reversed.`}
                        type="danger"
                    />
                </div>
            </div>
        </Layout>
    );
};

export default Employees;
