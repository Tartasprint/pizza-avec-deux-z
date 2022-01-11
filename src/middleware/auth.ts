import { NextFunction, Request } from "express";
import { ExpressResponse } from "models/session";

export default () => (req: Request, res: ExpressResponse, next: NextFunction) => {
    if (res.locals.user)
        next();
    else {
        res.status(403).render('unauthorized');
    }
}