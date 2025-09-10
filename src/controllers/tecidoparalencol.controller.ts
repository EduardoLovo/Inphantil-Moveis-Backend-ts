import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Campos expostos nas respostas (ocultamos `v`). */
const tecidoSelect = {
    id: true,
    cor: true,
    createdAt: true,
    estoque: true,
    imagem: true,
    quantidade: true,
    updatedAt: true,
} as const;

/* ================================================================== */
/* Tipagens dos bodies                                                */
/* ================================================================== */
export interface CreateTecidoParaLencolBody {
    cor: string;
    estoque: boolean;
    imagem: string;
    quantidade: number;
}

export interface UpdateTecidoParaLencolBody {
    cor?: string;
    estoque?: boolean;
    imagem?: string;
    quantidade?: number;
}

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */
function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

function isInt(v: unknown): v is number {
    return typeof v === 'number' && Number.isInteger(v);
}

/* ================================================================== */
/* GET /tecidoparalencols                                              */
/* ================================================================== */
export const getAllTecidoParaLencols = async (_req: Request, res: Response) => {
    try {
        const itens = await prisma.tecidoparalencols.findMany({
            select: tecidoSelect,
        });
        return res.status(200).json(itens);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar tecidos para lençol',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* GET /tecidoparalencols/:id                                          */
/* ================================================================== */
export const getTecidoParaLencolById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;
    try {
        const item = await prisma.tecidoparalencols.findUnique({
            where: { id },
            select: tecidoSelect,
        });
        if (!item) {
            return res
                .status(404)
                .json({ message: 'Tecido para lençol não encontrado' });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar tecido para lençol por ID',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* POST /tecidoparalencols                                             */
/* ================================================================== */
export const createTecidoParaLencol = async (
    req: Request<{}, {}, CreateTecidoParaLencolBody>,
    res: Response
) => {
    const { cor, estoque, imagem, quantidade } = req.body;

    // Validação
    if (!isNonEmptyString(cor) || !isNonEmptyString(imagem)) {
        return res
            .status(400)
            .json({ message: 'Preencha os campos cor e imagem.' });
    }
    if (typeof estoque !== 'boolean') {
        return res.status(400).json({
            message: 'O campo estoque deve ser boolean (true/false).',
        });
    }
    if (!isInt(quantidade)) {
        return res
            .status(400)
            .json({ message: 'O campo quantidade deve ser inteiro.' });
    }

    try {
        const novo = await prisma.tecidoparalencols.create({
            data: { cor, estoque, imagem, quantidade },
            select: tecidoSelect,
        });

        return res.status(201).json({
            message: 'Tecido para lençol criado com sucesso',
            data: novo,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao criar tecido para lençol',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* PATCH /tecidoparalencols/:id                                        */
/* ================================================================== */
export const updateTecidoParaLencol = async (
    req: Request<{ id: string }, {}, UpdateTecidoParaLencolBody>,
    res: Response
) => {
    const { id } = req.params;
    const { cor, estoque, imagem, quantidade } = req.body;

    try {
        const atual = await prisma.tecidoparalencols.findUnique({
            where: { id },
        });
        if (!atual) {
            return res
                .status(404)
                .json({ message: 'Tecido para lençol não encontrado' });
        }

        const updates: Record<string, unknown> = {};

        if (isNonEmptyString(cor) && cor !== atual.cor) {
            updates.cor = cor;
        }

        if (typeof estoque === 'boolean' && estoque !== atual.estoque) {
            updates.estoque = estoque;
        }

        if (isNonEmptyString(imagem) && imagem !== atual.imagem) {
            updates.imagem = imagem;
        }

        if (isInt(quantidade) && quantidade !== atual.quantidade) {
            updates.quantidade = quantidade;
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const atualizado = await prisma.tecidoparalencols.update({
            where: { id },
            data: updates,
            select: tecidoSelect,
        });

        return res.status(200).json({
            message: 'Tecido para lençol atualizado com sucesso',
            data: atualizado,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar tecido para lençol',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* DELETE /tecidoparalencols/:id                                       */
/* ================================================================== */
export const deleteTecidoParaLencol = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const existe = await prisma.tecidoparalencols.findUnique({
            where: { id },
        });
        if (!existe) {
            return res
                .status(404)
                .json({ message: 'Tecido para lençol não encontrado' });
        }

        await prisma.tecidoparalencols.delete({ where: { id } });

        return res
            .status(200)
            .json({ message: 'Tecido para lençol deletado com sucesso' });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao deletar tecido para lençol',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* FIM                                                                 */
/* ================================================================== */
