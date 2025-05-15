import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { ResearcherCard, ResearcherCardThread, Reply } from '../types';
import Comment from './Comment';

interface ResearcherCardViewProps {
    researcherId: number;
}

const ResearcherCardView: React.FC<ResearcherCardViewProps> = ({ researcherId }) => {
    const [researcher, setResearcher] = useState<ResearcherCard | null>(null);
    const [thread, setThread] = useState<ResearcherCardThread | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCommentFormExpanded, setIsCommentFormExpanded] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch researcher data
            const researcherResponse = await api.getResearcherCard(researcherId);
            const researcherData = researcherResponse;
            setResearcher(researcherData);

            // Fetch the researcher's thread using the thread ID from researcher data
            if (researcherData.researcher_card_thread_id) {
                const threadResponse = await api.getResearcherCardThread(researcherData.researcher_card_thread_id);
                setThread(threadResponse);
            }

            setError(null);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load researcher data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [researcherId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !thread) return;

        setIsSubmitting(true);
        try {
            await api.addCommentResearcherCardThread({
                thread_id: thread.id,
                parent_id: null,
                content: newComment
            });
            setNewComment('');
            fetchData(); // Refresh data after adding comment
        } catch (error) {
            console.error('Failed to add comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    if (loading) {
        return <div className="loading">Loading researcher data...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!researcher) {
        return <div className="not-found">Researcher not found</div>;
    }

    // Filter top-level comments (those with parent_id === null)
    const topLevelComments = thread?.replies.filter(reply => reply.parent_id === null) || [];

    return (
        <div className="researcher-card-view">
            {/* Researcher Information Section */}
            <div className="researcher-info">
                <h1>{researcher.name}</h1>
                <div className="researcher-details">
                    <p><strong>Affiliation:</strong> {researcher.affiliation}</p>
                    <p><strong>Citations:</strong> {researcher.citedby}</p>
                    <p><strong>Email Domain:</strong> {researcher.email_domain}</p>
                    <p><strong>Google Scholar ID:</strong>
                        <a href={`https://scholar.google.com/citations?user=${researcher.google_scholar_id}`} target="_blank" rel="noopener noreferrer">
                            {researcher.google_scholar_id}
                        </a>
                    </p>
                    <div className="researcher-interests">
                        <strong>Research Interests:</strong>
                        <ul>
                            {researcher.interests.map((interest, index) => (
                                <li key={index}>{interest}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Thread Section (similar to ThreadView) */}
            {thread && (
                <div className="thread-section">

                    <h2>{thread.title}</h2>
                    <div className="thread-info">
                        <span
                            className={`thread-id`}
                        >
                            Thread ID: {thread.id}
                        </span>
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
                                    reply_type="researcher_card"
                                    onReplyAdded={fetchData}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResearcherCardView;





