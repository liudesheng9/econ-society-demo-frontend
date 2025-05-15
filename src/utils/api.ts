import axios from 'axios';
import { Thread, NewThread, NewReply, ResearcherCardThread, ResearcherCard } from '../types';

const API_URL = 'http://localhost:8000/api';


// API logs storage
export const apiLogs: Array<{
    timestamp: Date;
    type: 'request' | 'response' | 'error';
    endpoint: string;
    method: string;
    data?: any;
    status?: number;
}> = [];

// Add request interceptor
axios.interceptors.request.use(
    (config) => {
        const url = config.url || '';

        apiLogs.push({
            timestamp: new Date(),
            type: 'request',
            endpoint: url,
            method: config.method?.toUpperCase() || 'UNKNOWN',
            data: config.data
        });

        return config;
    },
    (error) => {
        apiLogs.push({
            timestamp: new Date(),
            type: 'error',
            endpoint: error.config?.url || 'unknown',
            method: error.config?.method?.toUpperCase() || 'UNKNOWN',
            data: error
        });

        return Promise.reject(error);
    }
);

// Add response interceptor
axios.interceptors.response.use(
    (response) => {
        const url = response.config.url || '';

        apiLogs.push({
            timestamp: new Date(),
            type: 'response',
            endpoint: url,
            method: response.config.method?.toUpperCase() || 'UNKNOWN',
            data: response.data,
            status: response.status
        });

        return response;
    },
    (error) => {
        apiLogs.push({
            timestamp: new Date(),
            type: 'error',
            endpoint: error.config?.url || 'unknown',
            method: error.config?.method?.toUpperCase() || 'UNKNOWN',
            data: error.response?.data || error.message,
            status: error.response?.status
        });

        return Promise.reject(error);
    }
);


export const api = {
    // Get a list of all thread IDs
    async getThreadIds(): Promise<number[]> {
        const response = await axios.get<number[]>(`${API_URL}/threads`);
        return response.data;
    },

    // Get a specific thread with all its replies
    async getThread(id: number): Promise<Thread> {
        const response = await axios.get<Thread>(`${API_URL}/thread/${id}`);
        return response.data;
    },

    // Get the raw axios response for debugging
    async getThreadRaw(id: number): Promise<any> {
        const response = await axios.get<Thread>(`${API_URL}/thread/${id}`);
        return response;
    },

    // Create a new thread
    async createThread(newThread: NewThread): Promise<Thread> {
        const response = await axios.post<Thread>(`${API_URL}/threads`, newThread);
        return response.data;
    },

    // Add a comment/reply to a thread
    async addComment(newReply: NewReply): Promise<void> {
        await axios.post(`${API_URL}/comments`, newReply);
    },

    // Get all researcher card IDs
    async getResearcherCardIds(): Promise<number[]> {
        const response = await axios.get<number[]>(`${API_URL}/researcher_card/ids`);
        return response.data;
    },

    // Get a specific researcher card
    async getResearcherCard(id: number): Promise<ResearcherCard> {
        const response = await axios.get<ResearcherCard>(`${API_URL}/researcher_card/${id}`);
        return response.data;
    },


    // Get all researcher card thread ids
    async getResearcherCardThreadIds(id: number): Promise<number[]> {
        const response = await axios.get<number[]>(`${API_URL}/threads/researcher_card/ids`);
        return response.data;
    },

    // Get a specific researcher card thread
    async getResearcherCardThread(id: number): Promise<ResearcherCardThread> {
        const response = await axios.get<ResearcherCardThread>(`${API_URL}/threads/researcher_card/${id}`);
        return response.data;
    },

    // Add a comment/reply to a researcher card thread
    async addCommentResearcherCardThread(newReply: NewReply): Promise<void> {
        await axios.post(`${API_URL}/comments/researcher_card`, newReply);
    },



}; 
