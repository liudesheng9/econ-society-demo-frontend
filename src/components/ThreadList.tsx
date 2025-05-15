import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { Thread } from '../types';

const ThreadList: React.FC = () => {
    const [threadIds, setThreadIds] = useState<number[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newThreadTitle, setNewThreadTitle] = useState('');
    const [newThreadContent, setNewThreadContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchThreadIDs = async () => {
        setLoading(true);
        try {
            const ids = await api.getThreadIds();
            setThreadIds(ids);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch threads:', err);
            setError('Failed to load threads. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchThreads = async () => {
        try {
            const ids = await api.getThreadIds();
            const threads = await Promise.all(ids.map(id => api.getThread(id)));
            setThreads(threads);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch threads:', err);
            setError('Failed to load threads. Please try again.');
        } finally {
            setLoading(false);
        };
    }

    useEffect(() => {
        fetchThreadIDs();
        fetchThreads();
    }, []);

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newThreadTitle.trim()) return;

        setIsSubmitting(true);
        try {
            await api.createThread({ title: newThreadTitle, content: newThreadContent, room_id: 1 });
            setNewThreadTitle('');
            fetchThreadIDs(); // Refresh thread list
        } catch (error) {
            console.error('Failed to create thread:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading threads...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="thread-list">
            <h1>Reddit-style Discussion Threads</h1>

            <form onSubmit={handleCreateThread} className="create-thread-form">
                <h3>Create a New Thread</h3>
                <input
                    type="text"
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="Enter thread title..."
                    disabled={isSubmitting}
                />
                <input
                    type="text"
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    placeholder="Enter thread content..."
                    disabled={isSubmitting}
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Thread'}
                </button>
            </form>

            <h2>All Threads</h2>
            {threads.length === 0 ? (
                <p>No threads yet. Create your first thread above!</p>
            ) : (
                <ul className="threads">
                    {threads.map(thread => (
                        <li key={thread.id}>
                            <Link to={`/thread/${thread.id}`}>Thread #{thread.id}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ThreadList; 