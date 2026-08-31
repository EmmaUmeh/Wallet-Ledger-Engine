import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HTTPStatus } from "../utils/http.utils";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(HTTPStatus.UNAUTHORIZED).json("Authentication required.");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(HTTPStatus.UNAUTHORIZED).json("Invalid or expired token.");
    }
};