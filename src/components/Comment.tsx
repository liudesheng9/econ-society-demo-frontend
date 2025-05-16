import React, { useState } from 'react';
import { Reply } from '../types';
import { api } from '../utils/api';
import { ResearcherCard } from '../types';
import './Comments.css';


interface CommentProps {
    comment: Reply;
    replies: Reply[];
    threadId: number;
    reply_type: string;
    onReplyAdded: () => void;
}

const Comment: React.FC<CommentProps> = ({ comment, replies, threadId, reply_type, onReplyAdded }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hideReplies, setHideReplies] = useState(false);

    // Get all replies to this comment
    const childReplies = replies.filter(reply => reply.parent_id === comment.id);

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            if (reply_type === 'thread') {
                await api.addComment({
                    thread_id: threadId,
                    parent_id: comment.id,
                    content: replyContent
                });
            } else if (reply_type === 'researcher_card') {
                await api.addCommentResearcherCardThread({
                    thread_id: threadId,
                    parent_id: comment.id,
                    content: replyContent
                });
            }
            onReplyAdded();
            setReplyContent('');
            setShowReplyForm(false);
        } catch (error) {
            console.error('Failed to add reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="comment">
            <div className="comment-content">
                <div className="comment-header">
                    <span
                        className="comment-id"
                    >
                        ID: {comment.id}
                    </span>
                    <div className="comment-timestamp">
                        {comment.time ?
                            new Date(comment.time).toLocaleString() :
                            'No timestamp available'}
                    </div>
                </div>
                <p>{comment.content}</p>
                <div className="comment-actions">
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="reply-button"
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </button>
                </div>
            </div>

            {showReplyForm && (
                <form onSubmit={handleSubmitReply} className="reply-form">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        disabled={isSubmitting}
                    />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Reply'}
                    </button>
                </form>
            )}

            {childReplies.length > 0 && (
                <button
                    onClick={() => setHideReplies(!hideReplies)}
                    className="hide-replies-button"
                >
                    {hideReplies ?
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.625 9.375H14v1.25h-3.375V14h-1.25v-3.375H6v-1.25h3.375V6h1.25v3.375ZM20 10A10 10 0 1 1 10 0a10.011 10.011 0 0 1 10 10Zm-1.25 0A8.75 8.75 0 1 0 10 18.75 8.76 8.76 0 0 0 18.75 10Z"></path>
                        </svg> :
                        <svg fill="currentColor" height="16" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 10.625H6v-1.25h8v1.25ZM20 10a10 10 0 1 0-10 10 10.011 10.011 0 0 0 10-10Zm-1.25 0A8.75 8.75 0 1 1 10 1.25 8.76 8.76 0 0 1 18.75 10Z"></path>
                        </svg>}
                </button>
            )}

            {childReplies.length > 0 && !hideReplies && (
                <div className="comment-replies">
                    {childReplies.map(reply => (
                        <div key={reply.id} className="reply-container">
                            <div className="thread-line"></div>
                            <div className="reply-content">
                                <Comment
                                    comment={reply}
                                    replies={replies}
                                    threadId={threadId}
                                    reply_type={reply_type}
                                    onReplyAdded={onReplyAdded}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Comment; 