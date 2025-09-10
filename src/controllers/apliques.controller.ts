import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Campos expostos em respostas de API (oculta `v`). */
const apliqueSelect = {
    id: true,
    codigo: true,
    createdAt: true,
    estoque: true,
    imagem: true,
    ordem: true,
    quantidade: true,
    updatedAt: true,
} as const;

/* ================================================================== */
/* Tipagens dos bodies                                                */
/* ================================================================== */
export interface CreateApliqueBody {
    codigo: string;
    estoque: boolean; // deve ser boolean real
    imagem: string;
    ordem: number; // inteiro
    quantidade: number; // inteiro
}

export interface UpdateApliqueBody {
    codigo?: string;
    estoque?: boolean;
    imagem?: string;
    ordem?: number;
    quantidade?: number;
}

/* ================================================================== */
/* Helpers simples                                                     */
/* ================================================================== */
function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

function isInt(v: unknown): v is number {
    return typeof v === 'number' && Number.isInteger(v);
}

/* ================================================================== */
/* GET /apliques                                                       */
/* ================================================================== */
export const getAllApliques = async (_req: Request, res: Response) => {
    try {
        const itens = await prisma.apliques.findMany({ select: apliqueSelect });
        return res.status(200).json(itens);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar apliques',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* GET /apliques/:id                                                   */
/* ================================================================== */
export const getApliqueById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;
    try {
        const item = await prisma.apliques.findUnique({
            where: { id },
            select: apliqueSelect,
        });
        if (!item) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar aplique por ID',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* POST /apliques                                                      */
/* ================================================================== */
export const createAplique = async (
    req: Request<{}, {}, CreateApliqueBody>,
    res: Response
) => {
    const { codigo, estoque, imagem, ordem, quantidade } = req.body;

    // Validações básicas
    if (!isNonEmptyString(codigo) || !isNonEmptyString(imagem)) {
        return res
            .status(400)
            .json({ message: 'Preencha os campos codigo e imagem.' });
    }
    if (typeof estoque !== 'boolean') {
        return res.status(400).json({
            message: 'O campo estoque deve ser boolean (true/false).',
        });
    }
    if (!isInt(ordem) || !isInt(quantidade)) {
        return res.status(400).json({
            message: 'Os campos ordem e quantidade devem ser inteiros.',
        });
    }

    try {
        // Código único?
        const existente = await prisma.apliques.findUnique({
            where: { codigo },
        });
        if (existente) {
            return res.status(400).json({ message: 'Código já cadastrado' });
        }

        const novo = await prisma.apliques.create({
            data: { codigo, estoque, imagem, ordem, quantidade },
            select: apliqueSelect,
        });

        return res.status(201).json({
            message: 'Aplique criado com sucesso',
            data: novo,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao criar aplique',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* PATCH /apliques/:id                                                 */
/* ================================================================== */
export const updateAplique = async (
    req: Request<{ id: string }, {}, UpdateApliqueBody>,
    res: Response
) => {
    const { id } = req.params;
    const { codigo, estoque, imagem, ordem, quantidade } = req.body;

    try {
        const atual = await prisma.apliques.findUnique({ where: { id } });
        if (!atual) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }

        const updates: Record<string, unknown> = {};

        // codigo (único)
        if (isNonEmptyString(codigo) && codigo !== atual.codigo) {
            const duplicado = await prisma.apliques.findUnique({
                where: { codigo },
            });
            if (duplicado && duplicado.id !== id) {
                return res
                    .status(400)
                    .json({ message: 'Código já cadastrado' });
            }
            updates.codigo = codigo;
        }

        // estoque
        if (typeof estoque === 'boolean' && estoque !== atual.estoque) {
            updates.estoque = estoque;
        }

        // imagem
        if (isNonEmptyString(imagem) && imagem !== atual.imagem) {
            updates.imagem = imagem;
        }

        // ordem
        if (isInt(ordem) && ordem !== atual.ordem) {
            updates.ordem = ordem;
        }

        // quantidade
        if (isInt(quantidade) && quantidade !== atual.quantidade) {
            updates.quantidade = quantidade;
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const atualizado = await prisma.apliques.update({
            where: { id },
            data: updates,
            select: apliqueSelect,
        });

        return res.status(200).json({
            message: 'Aplique atualizado com sucesso',
            data: atualizado,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar aplique',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* DELETE /apliques/:id                                                */
/* ================================================================== */
export const deleteAplique = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const existe = await prisma.apliques.findUnique({ where: { id } });
        if (!existe) {
            return res.status(404).json({ message: 'Aplique não encontrado' });
        }

        await prisma.apliques.delete({ where: { id } });

        return res
            .status(200)
            .json({ message: 'Aplique deletado com sucesso' });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao deletar aplique',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* FIM                                                                 */
/* ================================================================== */
