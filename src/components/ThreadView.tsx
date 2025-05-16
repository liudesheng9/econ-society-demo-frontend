import React, { useEffect, useState } from 'react';
import { Thread, Reply } from '../types';
import { api, apiLogs } from '../utils/api';
import Comment from './Comment';
import { useNavigate } from 'react-router-dom';
import './ThreadView.css';

interface ThreadViewProps {
    threadId: number;
}

const ThreadView: React.FC<ThreadViewProps> = ({ threadId }) => {
    const [thread, setThread] = useState<Thread | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rawApiResponse, setRawApiResponse] = useState<any>(null);
    const [isCommentFormExpanded, setIsCommentFormExpanded] = useState(false);
    const navigate = useNavigate();

    const fetchThread = async () => {
        setLoading(true);
        try {
            const response = await api.getThreadRaw(threadId);
            setRawApiResponse(response);

            const threadData = response.data;
            setThread(threadData);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch thread:', err);
            setError('Failed to load thread. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThread();
    }, [threadId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            await api.addComment({
                thread_id: threadId,
                parent_id: null, // Top-level comment (parent_id 0 means direct reply to thread)
                content: newComment
            });
            setNewComment('');
            fetchThread(); // Refresh thread data after adding comment
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading thread...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!thread) {
        return <div className="not-found">Thread not found</div>;
    }

    // Filter top-level comments (those with parent_id === null)
    const topLevelComments = thread.replies.filter(reply => reply.parent_id === null);

    return (
        <div className="thread-view">

            <button className="back-button circle-button item-center" onClick={() => navigate('/thread')} aria-label="Back to threads">
                <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 9.25H3.81l6.22-6.22a.771.771 0 0 0-.015-1.046.772.772 0 0 0-1.045-.014l-7.5 7.5a.75.75 0 0 0 0 1.06l7.5 7.5c.283.27.77.263 1.046-.013a.772.772 0 0 0 .014-1.047l-6.22-6.22H18c.398 0 .75-.352.75-.75a.772.772 0 0 0-.75-.75Z"></path>
                </svg>
            </button>

            <h1>{thread.title}</h1>

            <div className="thread-timestamp">
                {thread.time ?
                    'created at ' + new Date(thread.time).toLocaleString() :
                    'No timestamp available'}
            </div>

            <div className="thread-content">
                <p>{thread.content}</p>
            </div>

            {isCommentFormExpanded ? (
                <form onSubmit={handleSubmitComment} className="comment-form expanded">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment..."
                        disabled={isSubmitting}
                        autoFocus
                    />
                    <div className="comment-actions">
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={() => {
                                setIsCommentFormExpanded(false);
                                setNewComment('');
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting || !newComment.trim()}>
                            {isSubmitting ? 'Submitting...' : 'Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div
                    className="comment-prompt"
                    onClick={() => setIsCommentFormExpanded(true)}
                >
                    Join the conversation
                </div>
            )}

            <div className="comments-section">
                {topLevelComments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    topLevelComments.map(comment => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            replies={thread.replies}
                            threadId={thread.id}
                            reply_type="thread"
                            onReplyAdded={fetchThread}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ThreadView; 