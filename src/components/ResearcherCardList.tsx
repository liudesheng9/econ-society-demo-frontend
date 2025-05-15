import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';
import { ResearcherCard } from '../types';



const ResearcherCards: React.FC = () => {
    const [researcherCards, setResearcherCards] = useState<ResearcherCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [researcherCardIds, setResearcherCardIds] = useState<number[]>([]);

    useEffect(() => {
        const fetchResearcherCards = async () => {
            setLoading(true);
            try {
                const ids = await api.getResearcherCardIds();
                setResearcherCardIds(ids);

                // Fetch details for each researcher card
                const cardsData = await Promise.all(
                    ids.map(id => api.getResearcherCard(id))
                );
                setResearcherCards(cardsData);

                setError(null);
            } catch (err) {
                console.error('Failed to fetch researchers:', err);
                setError('Failed to load researcher cards. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchResearcherCards();

    }, []);

    if (loading) {
        return <div className="loading">Loading researcher cards...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="researcher-cards">
            {researcherCards.map(card => (
                <Link to={`/researcher-card/${card.id}`} key={card.id} className="researcher-card">
                    <div className="card-id">ID: {card.id}</div>
                    <h3 className="card-title">{card.name}</h3>
                    <div className="card-affiliation">{card.affiliation}</div>
                    <div className="card-interests">
                        <strong>Interests:</strong> {card.interests.join(', ')}
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ResearcherCards;
