export interface Thread {
    id: number;
    title: string;
    content: string;
    replies: Reply[];
    room_id: number;
}

export interface Reply {
    id: string;
    parent_id: string | null;
    content: string;
}

export interface NewReply {
    thread_id: number;
    parent_id: string | null;
    content: string;
}

export interface NewThread {
    title: string;
    content: string;
    room_id: number;
}

export interface ResearcherCardThread {
    id: number;
    title: string;
    content: string;
    replies: Reply[];
    researcher_id: number
}

export interface ResearcherCard {
    id: number;
    affiliation: string;
    name: string;
    citedby: number;
    email_domain: string;
    interests: string[];
    google_scholar_publication_ids: string[];
    google_scholar_id: string;
    researcher_card_thread_id: number;
}
