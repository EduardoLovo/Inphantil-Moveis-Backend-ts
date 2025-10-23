import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Tipagem do corpo esperado no create */
interface CreateSinteticoBody {
    codigo: string;
    imagem: string;
    estoque: boolean;
    cor: string;
    tapete: boolean;
    externo: boolean;
}

/** Tipagem do corpo esperado no update (todos opcionais) */
interface UpdateSinteticoBody {
    codigo?: string;
    imagem?: string;
    estoque?: boolean;
    cor?: string;
    tapete?: boolean;
    externo?: boolean;
}

function isNonEmptyString(v: unknown): v is string {
    return typeof v === 'string' && v.trim().length > 0;
}

/* -------------------------------------------------- */
/* GET /sintetico                                      */
/* -------------------------------------------------- */
export const getAllSintetico = async (_req: Request, res: Response) => {
    try {
        const sinteticos = await prisma.sinteticos.findMany();
        return res.status(200).json(sinteticos);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar sintetico',
            error: (error as Error).message,
        });
    }
};

/* -------------------------------------------------- */
/* GET /sintetico/:id                                  */
/* -------------------------------------------------- */
export const getSinteticoById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;
    try {
        const sintetico = await prisma.sinteticos.findUnique({ where: { id } });

        if (!sintetico) {
            return res
                .status(404)
                .json({ message: 'Sintetico não encontrado' });
        }

        return res.status(200).json(sintetico);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar sintetico por ID',
            error: (error as Error).message,
        });
    }
};

/* -------------------------------------------------- */
/* POST /sintetico                                     */
/* -------------------------------------------------- */
export const createSintetico = async (
    req: Request<{}, {}, CreateSinteticoBody>,
    res: Response
) => {
    const { codigo, imagem, estoque, cor, tapete, externo } = req.body;

    // Validação simples
    if (
        !codigo ||
        !imagem ||
        estoque === undefined ||
        tapete === undefined ||
        !cor ||
        externo === undefined
    ) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    try {
        // Checar se código já existe
        const existe = await prisma.sinteticos.findUnique({
            where: { codigo },
        });
        if (existe) {
            return res.status(400).json({ message: 'Código já cadastrado' });
        }

        // Converter estoque

        const novo = await prisma.sinteticos.create({
            data: { codigo, imagem, estoque, cor, tapete, externo },
        });

        return res.status(201).json({
            message: 'Sintetico adicionado com sucesso',
            data: novo,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao criar sintetico',
            error: (error as Error).message,
        });
    }
};

/* -------------------------------------------------- */
/* PATCH /sintetico/:id                                */
/* -------------------------------------------------- */
export const updateSintetico = async (
    req: Request<{ id: string }, {}, UpdateSinteticoBody>,
    res: Response
) => {
    const { id } = req.params;
    const { codigo, imagem, estoque, cor, tapete, externo } = req.body;

    try {
        const atual = await prisma.sinteticos.findUnique({ where: { id } });
        if (!atual) {
            return res
                .status(404)
                .json({ message: 'Sintetico não encontrado' });
        }

        const updates: Record<string, unknown> = {};

        // Atualizar código (com checagem de duplicidade)
        if (isNonEmptyString(codigo) && codigo !== atual.codigo) {
            const duplicado = await prisma.sinteticos.findUnique({
                where: { codigo },
            });
            if (duplicado && duplicado.id !== id) {
                return res
                    .status(400)
                    .json({ message: 'Código já cadastrado' });
            }
            updates.codigo = codigo;
        }

        // Atualizar imagem
        if (isNonEmptyString(imagem) && imagem !== atual.imagem) {
            updates.imagem = imagem;
        }

        // Atualizar estoque
        if (typeof estoque === 'boolean' && estoque !== atual.estoque) {
            updates.estoque = estoque;
        }

        // Atualizar tapete
        if (typeof tapete === 'boolean' && tapete !== atual.tapete) {
            updates.tapete = tapete;
        }

        if (typeof externo === 'boolean' && externo !== atual.externo) {
            updates.externo = externo;
        }

        // Atualizar cor
        if (isNonEmptyString(cor) && cor !== atual.cor) {
            updates.cor = cor;
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const atualizado = await prisma.sinteticos.update({
            where: { id },
            data: updates,
        });

        return res.status(200).json({
            message: 'Sintetico atualizado com sucesso',
            data: atualizado,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar sintetico',
            error: (error as Error).message,
        });
    }
};

/* -------------------------------------------------- */
/* DELETE /sintetico/:id                               */
/* -------------------------------------------------- */
export const deleteSintetico = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const existe = await prisma.sinteticos.findUnique({ where: { id } });
        if (!existe) {
            return res
                .status(404)
                .json({ message: 'Sintetico não encontrado' });
        }

        await prisma.sinteticos.delete({ where: { id } });

        return res
            .status(200)
            .json({ message: 'Sintetico deletado com sucesso' });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao deletar sintetico',
            error: (error as Error).message,
        });
    }
};
