import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    onToggle?: (expanded: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
    const [expanded, setExpanded] = useState(true);

    const toggleSidebar = () => {
        const newExpanded = !expanded;
        setExpanded(newExpanded);
        if (onToggle) {
            onToggle(newExpanded);
        }
    };

    useEffect(() => {
        // Notify parent component of initial state
        if (onToggle) {
            onToggle(expanded);
        }
    }, [onToggle, expanded]);

    return (
        <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
            <div className="sidebar-header">
                <h2>{expanded ? 'Econ Society' : ''}</h2>
            </div>
            <button className="sidebar-toggle-button" onClick={toggleSidebar} aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}>
                <svg width="30" height="30" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.25 4.7H1.75A.772.772 0 0 1 1 3.95c0-.399.352-.75.75-.75h16.5c.398 0 .75.351.75.75 0 .397-.352.75-.75.75ZM19 9.996a.772.772 0 0 0-.75-.75H1.75a.772.772 0 0 0-.75.75c0 .398.352.75.75.75h16.5c.398 0 .75-.352.75-.75Zm0 6.047a.772.772 0 0 0-.75-.75H1.75a.772.772 0 0 0-.75.75c0 .398.352.75.75.75h16.5c.398 0 .75-.352.75-.75Z"></path>
                </svg>
            </button>
            {expanded && (
                <div className="sidebar-nav">
                    <div className="sidebar-nav-links">
                        <Link to="/">
                            <span className="link-text">Home</span>
                        </Link>
                    </div>
                    <div className="sidebar-nav-links">
                        <Link to="/thread">
                            <span className="link-text">Threads</span>
                        </Link>
                    </div>
                    <div className="sidebar-nav-links">
                        <Link to="/researcher-card">
                            <span className="link-text">Researcher Cards</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar; 