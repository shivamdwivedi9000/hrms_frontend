import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/token', formData);
    if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
    return api.get('/users/me');
};

// Employee Management
export const getEmployees = async () => {
    const response = await api.get('/employees/');
    return response.data;
};

export const createEmployee = async (employeeData) => {
    const response = await api.post('/employees/', employeeData);
    return response.data;
};

export const deleteEmployee = async (empId) => {
    await api.delete(`/employees/${empId}`);
};

// Attendance Management
export const getAttendance = async (empId = null) => {
    const url = empId ? `/attendance/${empId}` : '/attendance/';
    const response = await api.get(url);
    return response.data;
};

export const markAttendance = async (attendanceData) => {
    const response = await api.post('/attendance/', attendanceData);
    return response.data;
};

export default api;
