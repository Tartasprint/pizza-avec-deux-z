import { User } from './user'
import { Response } from 'express'
declare module 'express-session' {
    interface SessionData {
        userID: string;
    }
}

import { SessionData } from 'express-session';
import { Ctx } from 'hexnut';

interface ExpressLocals {
    user: User | null
}
type ExpressResponse = Response<{}, ExpressLocals>
interface CtxExt { session: { user: User | null } }
type HexnutCtx = Ctx<CtxExt>

export { SessionData, ExpressLocals, ExpressResponse, HexnutCtx }