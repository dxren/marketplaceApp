export interface DevNote {
    id: string;
    content: string;
    date: string;
}

export const devNotes: DevNote[] = [{
    id: "1",
    content: "Thank you for reading our first set of dev Notes for Fractal Marketplace. We are working on releasing messaging between users and rate limiting the number of posts per minute (to handle spam). If you find any bugs or have feature requests, let us know!",
    date: "August 2024"
}]

export function getDevNotes(): DevNote[] {
    return devNotes
}