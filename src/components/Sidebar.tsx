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
            <button className="sidebar-toggle-button" onClick={toggleSidebar}>
                {expanded ? '◀' : '▶'}
            </button>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/">
                        {expanded && <span className="link-text">Home</span>}
                    </Link></li>
                    <li><Link to="/thread">
                        {expanded && <span className="link-text">Threads</span>}
                    </Link></li>
                    <li><Link to="/researcher-card">
                        {expanded && <span className="link-text">Researcher Cards</span>}
                    </Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar; 