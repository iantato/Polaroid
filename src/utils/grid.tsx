import { Polaroid } from "@/components/Polaroid";

export function calculateGridWidth(number: number) {
    const size = Math.ceil(Math.sqrt(number));
    return size
}

export function calculateGridHeight(number: number) {
    const size = Math.ceil(number / Math.ceil(Math.sqrt(number)));
    return size
}

export function getTotalPictures(polaroids: typeof Polaroid[] | undefined) {
    if (!polaroids) return 0;
    return polaroids.length
}