import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Campos expostos em respostas da API (oculta `v`). */
const pantoneSelect = {
    id: true,
    codigo: true,
    cor: true,
    createdAt: true,
    estoque: true,
    imagem: true,
    updatedAt: true,
} as const;

/* ================================================================== */
/* Tipagens dos bodies                                                */
/* ================================================================== */
export interface CreatePantoneBody {
    codigo: string;
    cor: string;
    estoque: boolean;
    imagem: string;
}

export interface UpdatePantoneBody {
    codigo?: string;
    cor?: string;
    estoque?: boolean;
    imagem?: string;
}

/* ================================================================== */
/* Helpers                                                             */
/* ================================================================== */
function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

/* ================================================================== */
/* GET /pantones                                                       */
/* ================================================================== */
export const getAllPantones = async (_req: Request, res: Response) => {
    try {
        const itens = await prisma.pantones.findMany({ select: pantoneSelect });
        return res.status(200).json(itens);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar pantones',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* GET /pantones/:id                                                   */
/* ================================================================== */
export const getPantoneById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;
    try {
        const item = await prisma.pantones.findUnique({
            where: { id },
            select: pantoneSelect,
        });
        if (!item) {
            return res.status(404).json({ message: 'Pantone não encontrado' });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar pantone por ID',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* POST /pantones                                                      */
/* ================================================================== */
export const createPantone = async (
    req: Request<{}, {}, CreatePantoneBody>,
    res: Response
) => {
    const { codigo, cor, estoque, imagem } = req.body;

    // Validação básica
    if (
        !isNonEmptyString(codigo) ||
        !isNonEmptyString(cor) ||
        !isNonEmptyString(imagem)
    ) {
        return res
            .status(400)
            .json({ message: 'Preencha os campos codigo, cor e imagem.' });
    }
    if (typeof estoque !== 'boolean') {
        return res.status(400).json({
            message: 'O campo estoque deve ser boolean (true/false).',
        });
    }

    try {
        // Código único?
        const existente = await prisma.pantones.findUnique({
            where: { codigo },
        });
        if (existente) {
            return res.status(400).json({ message: 'Código já cadastrado' });
        }

        const novo = await prisma.pantones.create({
            data: { codigo, cor, estoque, imagem },
            select: pantoneSelect,
        });

        return res.status(201).json({
            message: 'Pantone criado com sucesso',
            data: novo,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao criar pantone',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* PATCH /pantones/:id                                                 */
/* ================================================================== */
export const updatePantone = async (
    req: Request<{ id: string }, {}, UpdatePantoneBody>,
    res: Response
) => {
    const { id } = req.params;
    const { codigo, cor, estoque, imagem } = req.body;

    try {
        const atual = await prisma.pantones.findUnique({ where: { id } });
        if (!atual) {
            return res.status(404).json({ message: 'Pantone não encontrado' });
        }

        const updates: Record<string, unknown> = {};

        // codigo (único)
        if (isNonEmptyString(codigo) && codigo !== atual.codigo) {
            const duplicado = await prisma.pantones.findUnique({
                where: { codigo },
            });
            if (duplicado && duplicado.id !== id) {
                return res
                    .status(400)
                    .json({ message: 'Código já cadastrado' });
            }
            updates.codigo = codigo;
        }

        if (isNonEmptyString(cor) && cor !== atual.cor) {
            updates.cor = cor;
        }

        if (typeof estoque === 'boolean' && estoque !== atual.estoque) {
            updates.estoque = estoque;
        }

        if (isNonEmptyString(imagem) && imagem !== atual.imagem) {
            updates.imagem = imagem;
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const atualizado = await prisma.pantones.update({
            where: { id },
            data: updates,
            select: pantoneSelect,
        });

        return res.status(200).json({
            message: 'Pantone atualizado com sucesso',
            data: atualizado,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar pantone',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* DELETE /pantones/:id                                                */
/* ================================================================== */
export const deletePantone = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const existe = await prisma.pantones.findUnique({ where: { id } });
        if (!existe) {
            return res.status(404).json({ message: 'Pantone não encontrado' });
        }

        await prisma.pantones.delete({ where: { id } });

        return res
            .status(200)
            .json({ message: 'Pantone deletado com sucesso' });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao deletar pantone',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* FIM                                                                 */
/* ================================================================== */
