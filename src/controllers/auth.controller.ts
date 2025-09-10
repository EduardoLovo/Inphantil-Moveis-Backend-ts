import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
    try {
        const { usuario, senha, tipo } = req.body;

        // Verificar se o usuário já existe
        const existingUser = await prisma.usuarios.findUnique({
            where: { usuario },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar usuário
        await prisma.usuarios.create({
            data: { usuario, senha: hashedPassword, tipo },
        });

        res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        res.status(400).json({ message: 'Erro ao registrar usuário', error });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { usuario, senha } = req.body;

        const user = await prisma.usuarios.findUnique({ where: { usuario } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'defaultsecret',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                usuario: user.usuario,
                tipo: user.tipo,
            },
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            message: 'Erro ao fazer login',
            error: (error as Error).message,
        });
    }
};
