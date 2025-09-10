import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** Campos expostos nas respostas da API (oculta `v`). */
const lencolSelect = {
    id: true,
    codigo: true,
    cor: true,
    createdAt: true,
    imagem: true,
    quantidade: true,
    tamanho: true,
    updatedAt: true,
} as const;

/* ================================================================== */
/* Tipagens dos bodies                                                */
/* ================================================================== */
export interface CreateLencolBody {
    codigo: string;
    cor: string;
    imagem: string;
    quantidade: number;
    tamanho: string;
}

export interface UpdateLencolBody {
    codigo?: string;
    cor?: string;
    imagem?: string;
    quantidade?: number;
    tamanho?: string;
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
/* GET /lencolprontaentregas                                           */
/* ================================================================== */
export const getAllLencolProntaEntregas = async (
    _req: Request,
    res: Response
) => {
    try {
        const itens = await prisma.lencolprontaentregas.findMany({
            select: lencolSelect,
        });
        return res.status(200).json(itens);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar lencol pronta entrega',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* GET /lencolprontaentregas/:id                                       */
/* ================================================================== */
export const getLencolProntaEntregaById = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;
    try {
        const item = await prisma.lencolprontaentregas.findUnique({
            where: { id },
            select: lencolSelect,
        });
        if (!item) {
            return res
                .status(404)
                .json({ message: 'Lencol pronta entrega não encontrado' });
        }
        return res.status(200).json(item);
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao buscar lencol pronta entrega por ID',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* POST /lencolprontaentregas                                          */
/* ================================================================== */
export const createLencolProntaEntrega = async (
    req: Request<{}, {}, CreateLencolBody>,
    res: Response
) => {
    const { codigo, cor, imagem, quantidade, tamanho } = req.body;

    // Validação básica
    if (
        !isNonEmptyString(codigo) ||
        !isNonEmptyString(cor) ||
        !isNonEmptyString(imagem) ||
        !isNonEmptyString(tamanho)
    ) {
        return res.status(400).json({
            message: 'Preencha os campos codigo, cor, imagem e tamanho.',
        });
    }
    if (!isInt(quantidade)) {
        return res
            .status(400)
            .json({ message: 'O campo quantidade deve ser inteiro.' });
    }

    try {
        // -> Se quiser tratar codigo como único, descomente:
        // const existente = await prisma.lencolprontaentregas.findFirst({ where: { codigo } });
        // if (existente) {
        //   return res.status(400).json({ message: 'Código já cadastrado' });
        // }

        const novo = await prisma.lencolprontaentregas.create({
            data: { codigo, cor, imagem, quantidade, tamanho },
            select: lencolSelect,
        });

        return res.status(201).json({
            message: 'Lencol pronta entrega criado com sucesso',
            data: novo,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao criar lencol pronta entrega',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* PATCH /lencolprontaentregas/:id                                     */
/* ================================================================== */
export const updateLencolProntaEntrega = async (
    req: Request<{ id: string }, {}, UpdateLencolBody>,
    res: Response
) => {
    const { id } = req.params;
    const { codigo, cor, imagem, quantidade, tamanho } = req.body;

    try {
        const atual = await prisma.lencolprontaentregas.findUnique({
            where: { id },
        });
        if (!atual) {
            return res
                .status(404)
                .json({ message: 'Lencol pronta entrega não encontrado' });
        }

        const updates: Record<string, unknown> = {};

        if (isNonEmptyString(codigo) && codigo !== atual.codigo) {
            // -> Se quiser validar duplicidade (caso não unique no DB):
            // const duplicado = await prisma.lencolprontaentregas.findFirst({ where: { codigo } });
            // if (duplicado && duplicado.id !== id) {
            //   return res.status(400).json({ message: 'Código já cadastrado' });
            // }
            updates.codigo = codigo;
        }

        if (isNonEmptyString(cor) && cor !== atual.cor) {
            updates.cor = cor;
        }

        if (isNonEmptyString(imagem) && imagem !== atual.imagem) {
            updates.imagem = imagem;
        }

        if (isInt(quantidade) && quantidade !== atual.quantidade) {
            updates.quantidade = quantidade;
        }

        if (isNonEmptyString(tamanho) && tamanho !== atual.tamanho) {
            updates.tamanho = tamanho;
        }

        if (Object.keys(updates).length === 0) {
            return res
                .status(400)
                .json({ message: 'Nenhuma alteração detectada' });
        }

        const atualizado = await prisma.lencolprontaentregas.update({
            where: { id },
            data: updates,
            select: lencolSelect,
        });

        return res.status(200).json({
            message: 'Lencol pronta entrega atualizado com sucesso',
            data: atualizado,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao atualizar lencol pronta entrega',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* DELETE /lencolprontaentregas/:id                                    */
/* ================================================================== */
export const deleteLencolProntaEntrega = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const { id } = req.params;

    try {
        const existe = await prisma.lencolprontaentregas.findUnique({
            where: { id },
        });
        if (!existe) {
            return res
                .status(404)
                .json({ message: 'Lencol pronta entrega não encontrado' });
        }

        await prisma.lencolprontaentregas.delete({ where: { id } });

        return res
            .status(200)
            .json({ message: 'Lencol pronta entrega deletado com sucesso' });
    } catch (error) {
        return res.status(500).json({
            message: 'Erro ao deletar lencol pronta entrega',
            error: (error as Error).message,
        });
    }
};

/* ================================================================== */
/* FIM                                                                 */
/* ================================================================== */
