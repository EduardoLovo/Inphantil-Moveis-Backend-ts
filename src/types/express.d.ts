import 'express';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        userId?: string;
        tokenPayload?: JwtPayload | string; // opcional: payload completo
    }
}
