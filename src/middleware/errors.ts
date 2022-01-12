import { NextFunction, Request, Response } from "express";
import { ForbiddenError, NotFoundError } from "oso";

export function handleError(err: any, req: Request, res: Response, next: NextFunction) {
    console.log('Handling')
    if (res.headersSent) {
        return next(err)
    }
    if (err instanceof ForbiddenError) {
        res.status(403).send("Forbidden");
    } else if (err instanceof NotFoundError) {
        res.status(404).send("Not found");
    } else {
        // Handle other errors
    }
}