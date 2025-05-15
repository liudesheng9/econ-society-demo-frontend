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
                    {hideReplies ? '+' : `-`}
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