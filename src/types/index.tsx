
// Polaroid types.
export interface PolaroidProps {
    id: string;
    src: string;
    alt: string;
    caption?: string;
}

// Database Types.
export interface Polaroid {
    id: string;
    src: string;
    alt: string;
    caption?: string;
    scanned: boolean;
    scanned_at: Date;
}

// API Response Types.
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Query Types.
export interface Query<T> {
    query: string;
    values: any[];
}

export interface SearchParams {
    id: number | undefined
}