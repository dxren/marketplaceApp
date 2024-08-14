import { LooseAuthProp } from "@clerk/clerk-sdk-node";
import { UserSummary } from '../shared/types';

type LooseUserProp = {
    user: UserSummary | null;
}

declare global {
    namespace Express {
        interface Request extends LooseAuthProp, LooseUserProp {}
    }
}