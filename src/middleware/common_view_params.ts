import { Request } from "express";
import { User } from "../models/user.js";
import { ExpressResponse } from "../models/session";
export const load_user = async (req: Request): Promise<User | null> => {
    if (req.session.userID === undefined) return null;
    else {
        return await User.from_id(req.session.userID)
    }
}

export default async (req: Request, res: ExpressResponse, next) => {
    res.locals.user = await load_user(req);
    next();
}