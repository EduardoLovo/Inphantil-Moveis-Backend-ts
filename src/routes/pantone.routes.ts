import { Router } from 'express';
import {
    getAllPantones,
    getPantoneById,
    createPantone,
    updatePantone,
    deletePantone,
} from '../controllers/pantone.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 * /pantones:
 *   get:
 *     summary: Lista todos os pantones.
 *     tags:
 *       - Pantones
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso.
 *   post:
 *     summary: Cria um novo pantone (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - cor
 *               - estoque
 *               - imagem
 *             properties:
 *               codigo:
 *                 type: string
 *               cor:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               imagem:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Pantone criado com sucesso.
 *       '400':
 *         description: Dados inválidos.
 */
router.get('/', getAllPantones);
router.post('/', authMiddleware, createPantone);

/**
 * @openapi
 * /pantones/{id}:
 *   get:
 *     summary: Busca um pantone pelo ID.
 *     tags:
 *       - Pantones
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pantone encontrado.
 *       '404':
 *         description: Pantone não encontrado.
 *   patch:
 *     summary: Atualiza campos de um pantone (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantones
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               cor:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               imagem:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Pantone atualizado com sucesso.
 *       '400':
 *         description: Nenhuma alteração detectada ou dados inválidos.
 *       '404':
 *         description: Pantone não encontrado.
 *   delete:
 *     summary: Deleta um pantone pelo ID (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantones
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Pantone deletado com sucesso.
 *       '404':
 *         description: Pantone não encontrado.
 */
router.get('/:id', getPantoneById);
router.patch('/:id', authMiddleware, updatePantone);
router.delete('/:id', authMiddleware, deletePantone);

export default router;
