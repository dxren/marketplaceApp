export interface DevNote {
    id: string;
    content: string;
    date: string;
}

export const devNotes: DevNote[] = [{
    id: "1",
    content: "test content",
    date: "August 2024"
}]

export function getDevNotes(): DevNote[] {
    return devNotes
}