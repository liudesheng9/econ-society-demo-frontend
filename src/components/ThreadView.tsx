import React, { useEffect, useState } from 'react';
import { Thread, Reply } from '../types';
import { api, apiLogs } from '../utils/api';
import Comment from './Comment';

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

            <h1>{thread.title}</h1>
            <div className="thread-info">
                <span
                >
                    Thread ID: {thread.id}
                </span>
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
                <h3>Comments</h3>
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