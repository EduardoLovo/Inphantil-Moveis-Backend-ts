import { Router } from 'express';
import {
    getAllTecidoParaLencols,
    getTecidoParaLencolById,
    createTecidoParaLencol,
    updateTecidoParaLencol,
    deleteTecidoParaLencol,
} from '../controllers/tecidoparalencol.controller';

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
 * /tecidoparalencols:
 *   get:
 *     summary: Lista todos os tecidos para lençol.
 *     tags:
 *       - TecidosParaLencol
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso.
 *   post:
 *     summary: Cria um novo tecido para lençol (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TecidosParaLencol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cor
 *               - estoque
 *               - imagem
 *               - quantidade
 *             properties:
 *               cor:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               imagem:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Tecido criado com sucesso.
 *       '400':
 *         description: Dados inválidos.
 */
router.get('/', getAllTecidoParaLencols);
router.post('/', createTecidoParaLencol);

/**
 * @openapi
 * /tecidoparalencols/{id}:
 *   get:
 *     summary: Busca um tecido para lençol pelo ID.
 *     tags:
 *       - TecidosParaLencol
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tecido encontrado.
 *       '404':
 *         description: Tecido não encontrado.
 *   patch:
 *     summary: Atualiza campos de um tecido para lençol (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TecidosParaLencol
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
 *               cor:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               imagem:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Tecido atualizado com sucesso.
 *       '400':
 *         description: Nenhuma alteração detectada ou dados inválidos.
 *       '404':
 *         description: Tecido não encontrado.
 *   delete:
 *     summary: Deleta um tecido para lençol pelo ID (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - TecidosParaLencol
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tecido deletado com sucesso.
 *       '404':
 *         description: Tecido não encontrado.
 */
router.get('/:id', getTecidoParaLencolById);
router.patch('/:id', updateTecidoParaLencol);
router.delete('/:id', deleteTecidoParaLencol);

export default router;
