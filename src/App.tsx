import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css';
import ThreadList from './components/ThreadList';
import ThreadView from './components/ThreadView';
import ResearcherCardList from './components/ResearcherCardList';
import ResearcherCardView from './components/ResearcherCardView';
import Sidebar from './components/Sidebar';

// Home component for the root route
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Econ Society</h1>
      <p>Explore threads and researcher cards using the navigation.</p>
    </div>
  );
};

const App: React.FC = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleSidebarToggle = (expanded: boolean) => {
    setSidebarExpanded(expanded);
  };

  return (
    <Router>
      <div className="app">
        <Sidebar onToggle={handleSidebarToggle} />
        <div className={`content ${sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thread" element={<ThreadList />} />
            <Route path="/thread/:id" element={<ThreadRouteWrapper />} />
            <Route path="/researcher-card" element={<ResearcherCardList />} />
            <Route path="/researcher-card/:id" element={<ResearcherCardRouteWrapper />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// This wrapper component extracts the thread ID from the URL params
const ThreadRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="error">Thread ID not found</div>;
  }

  return <ThreadView threadId={parseInt(id, 10)} />;
};


const ResearcherCardRouteWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="error">Researcher Card ID not found</div>;
  }

  return <ResearcherCardView researcherId={parseInt(id, 10)} />;
};

export default App;
