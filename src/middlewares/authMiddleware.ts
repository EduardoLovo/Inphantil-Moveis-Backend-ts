import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthTokenPayload extends JwtPayload {
    userId: string;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader?.trim(); // fallback: token direto

    if (!token) {
        return res
            .status(401)
            .json({ message: 'Acesso negado. Token não fornecido.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET não definido no .env');
        return res
            .status(500)
            .json({ message: 'Erro de configuração do servidor.' });
    }

    try {
        const decoded = jwt.verify(token, secret) as AuthTokenPayload;
        req.userId = decoded.userId;
        req.tokenPayload = decoded; // útil se quiser roles/claims

        return next();
    } catch {
        return res.status(401).json({ message: 'Token inválido.' });
    }
}
