import { Router } from 'express';
import {
    getAllLencolProntaEntregas,
    getLencolProntaEntregaById,
    createLencolProntaEntrega,
    updateLencolProntaEntrega,
    deleteLencolProntaEntrega,
} from '../controllers/lencolprontaentregas.controller';

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
 * /lencolprontaentrega:
 *   get:
 *     summary: Lista todos os itens de Lencol Pronta Entrega.
 *     tags:
 *       - LencolProntaEntrega
 *     responses:
 *       '200':
 *         description: Lista retornada com sucesso.
 *   post:
 *     summary: Cria um novo item de Lencol Pronta Entrega (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - LencolProntaEntrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - cor
 *               - imagem
 *               - quantidade
 *               - tamanho
 *             properties:
 *               codigo:
 *                 type: string
 *               cor:
 *                 type: string
 *               imagem:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               tamanho:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Item criado com sucesso.
 *       '400':
 *         description: Dados inválidos.
 */
router.get('/', getAllLencolProntaEntregas);
router.post('/', createLencolProntaEntrega);

/**
 * @openapi
 * /lencolprontaentrega/{id}:
 *   get:
 *     summary: Busca um item de Lencol Pronta Entrega pelo ID.
 *     tags:
 *       - LencolProntaEntrega
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
 *     summary: Atualiza campos de um item de Lencol Pronta Entrega (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - LencolProntaEntrega
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
 *               imagem:
 *                 type: string
 *               quantidade:
 *                 type: integer
 *               tamanho:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Item atualizado com sucesso.
 *       '400':
 *         description: Nenhuma alteração detectada ou dados inválidos.
 *       '404':
 *         description: Item não encontrado.
 *   delete:
 *     summary: Deleta um item de Lencol Pronta Entrega pelo ID (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - LencolProntaEntrega
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
router.get('/:id', getLencolProntaEntregaById);
router.patch('/:id', updateLencolProntaEntrega);
router.delete('/:id', deleteLencolProntaEntrega);

export default router;
