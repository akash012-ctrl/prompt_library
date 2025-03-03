import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AuthResponse {
    token: string;
}

export interface ErrorResponse {
    errors: Array<{
        msg: string;
        param?: string;
    }>;
}

export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, {
            email,
            password
        });
        const { token } = response.data;
        console.log('Received token:', token); // Add logging
        localStorage.setItem('token', token);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { errors: [{ msg: 'Network error' }] };
    }
};

export const register = async (email: string, password: string) => {
    try {
        const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/register`, {
            email,
            password
        });
        const { token } = response.data;
        console.log('Received token after registration:', token); // Add logging
        localStorage.setItem('token', token);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || { errors: [{ msg: 'Network error' }] };
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        // console.log('Retrieved token from storage:', token); // Add logging
        return token;
    }
    return null;
};

export const getAuthHeaders = () => {
    const token = getAuthToken();
    // console.log('Retrieved token from storage:', token); // Add logging
    return token ? {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    } : {};
};