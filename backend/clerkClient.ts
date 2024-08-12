import { createClerkClient } from "@clerk/clerk-sdk-node";

const secretKey = process.env.CLERK_SECRET_KEY;
const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;

if (!secretKey) {
    throw new Error('Unable to load CLERK_SECRET_KEY');
} else if (!publishableKey) {
    throw new Error('Unable to load CLERK_PUBLISHABLE_KEY');
}

export const clerkClient = createClerkClient({secretKey, publishableKey});