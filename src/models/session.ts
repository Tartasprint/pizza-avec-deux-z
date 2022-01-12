import { User } from './user'
import { Response } from 'express'
declare module 'express-session' {
    interface SessionData {
        userID: string;
    }
}

import { SessionData } from 'express-session';
import { Ctx } from 'hexnut';
import { TOso } from 'config/initOso';


export interface ExpressLocalsApp {
    oso: TOso
}


interface ExpressLocals extends ExpressLocalsApp {
    user: User | null
}

type ExpressResponse = Response<{}, ExpressLocals>
interface CtxExt { session: { user: User | null }, oso: TOso }
export type HexnutCtx = Ctx<CtxExt>
export type HexnutExt = CtxExt

export { SessionData, ExpressLocals, ExpressResponse }