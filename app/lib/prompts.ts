import axios, { AxiosError } from 'axios';
import { getAuthHeaders } from './auth';
import { jwtDecode } from 'jwt-decode';


const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Prompt {
    _id: any;
    title: string;
    description: string;
    tags: string[];
    category: string;
    userId: string;
}

interface JwtPayload {
    userId: string;
    email: string;
}

interface ApiErrorResponse {
    errors: Array<{
        msg: string;
        param?: string;
    }>;
}

export const getCurrentUserId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        // console.log('Decoded JWT:', decoded); // Add logging
        return decoded.userId;
    } catch (error) {
        console.error('Failed to decode JWT:', error); // Add logging
        return null;
    }
};

const handleApiError = (error: unknown): never => {
    if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data;
    }
    throw { errors: [{ msg: 'Network error' }] };
};

export const getPrompts = async (): Promise<Prompt[]> => {
    try {
        const response = await axios.get<Prompt[]>(`${BASE_URL}/prompts`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getPrompt = async (id: string): Promise<Prompt> => {
    try {
        const response = await axios.get<Prompt>(`${BASE_URL}/prompts/${id}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const createPrompt = async (promptData: Omit<Prompt, '_id'>): Promise<Prompt> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    try {
        const response = await axios.post<Prompt>(
            `${BASE_URL}/prompts`,
            { ...promptData, userId },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updatePrompt = async (id: string, promptData: Partial<Prompt>): Promise<Prompt> => {
    try {
        const response = await axios.put<Prompt>(
            `${BASE_URL}/prompts/${id}`,
            promptData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deletePrompt = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/prompts/${id}`, getAuthHeaders());
    } catch (error) {
        throw handleApiError(error);
    }
};

export const searchPrompts = async (query: string): Promise<Prompt[]> => {
    try {
        const response = await axios.get<Prompt[]>(`${BASE_URL}/prompts/search?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};