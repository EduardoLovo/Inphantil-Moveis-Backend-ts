import { Router } from 'express';
import {
    getAllSintetico,
    getSinteticoById,
    createSintetico,
    updateSintetico,
    deleteSintetico,
} from '../controllers/sintetico.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 *   components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 * /sintetico:
 *   get:
 *     summary: Lista todos os itens de sintetico.
 *     tags:
 *       - Sintetico
 *     responses:
 *       '200':
 *         description: Lista de itens retornada com sucesso.
 *   post:
 *     summary: Cria um novo item de sintetico (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sintetico
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - imagem
 *               - estoque
 *               - cor
 *             properties:
 *               codigo:
 *                 type: string
 *               imagem:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               cor:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Item criado com sucesso.
 *       '400':
 *         description: Dados inválidos.
 */
router.get('/', getAllSintetico);
router.post('/', authMiddleware, createSintetico);

/**
 * @openapi
 * /sintetico/{id}:
 *   get:
 *     summary: Busca um sintetico pelo ID.
 *     tags:
 *       - Sintetico
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Item encontrado.
 *       '404':
 *         description: Item não encontrado.
 *   patch:
 *     summary: Atualiza um sintetico (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sintetico
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
 *               imagem:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               cor:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Item atualizado com sucesso.
 *       '400':
 *         description: Nenhuma alteração detectada.
 *       '404':
 *         description: Item não encontrado.
 *   delete:
 *     summary: Deleta um sintetico pelo ID (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sintetico
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Item deletado com sucesso.
 *       '404':
 *         description: Item não encontrado.
 */
router.get('/:id', getSinteticoById);
router.patch('/:id', updateSintetico);
router.delete('/:id', deleteSintetico);

export default router;
