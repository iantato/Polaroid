
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

export interface SearchParams {
    id: number | undefined
}