import { LooseAuthProp } from "@clerk/clerk-sdk-node";
import { User } from '../shared/apiTypes';

type LooseUserProp = {
    user: User | null;
}

declare global {
    namespace Express {
        interface Request extends LooseAuthProp, LooseUserProp {}
    }
}