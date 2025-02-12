export interface PolaroidProps {
    id: string;
    src: string;
    alt: string;
    caption?: string;
    isDraggable?: boolean;
    resetFlip?: boolean;
}