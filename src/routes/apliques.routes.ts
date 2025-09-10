import { Router } from 'express';
import {
    getAllApliques,
    getApliqueById,
    createAplique,
    updateAplique,
    deleteAplique,
} from '../controllers/apliques.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @openapi
 *  components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * security:
 *   - bearerAuth: []
 * /apliques:
 *   get:
 *     summary: Lista todos os apliques.
 *     tags:
 *       - Apliques
 *     responses:
 *       '200':
 *         description: Lista de apliques retornada com sucesso.
 *   post:
 *     summary: Cria um novo aplique (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Apliques
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigo
 *               - estoque
 *               - imagem
 *               - ordem
 *               - quantidade
 *             properties:
 *               codigo:
 *                 type: string
 *               estoque:
 *                 type: boolean
 *               imagem:
 *                 type: string
 *               ordem:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Aplique criado com sucesso.
 *       '400':
 *         description: Dados inválidos ou código já cadastrado.
 */
router.get('/', getAllApliques);
router.post('/', authMiddleware, createAplique);

/**
 * @openapi
 * /Apliques/{id}:
 *   get:
 *     summary: Busca um aplique pelo ID.
 *     tags:
 *       - Apliques
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Aplique encontrado.
 *       '404':
 *         description: Aplique não encontrado.
 *   patch:
 *     summary: Atualiza campos de um Aplique (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Apliques
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
 *               estoque:
 *                 type: boolean
 *               imagem:
 *                 type: string
 *               ordem:
 *                 type: integer
 *               quantidade:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Aplique atualizado com sucesso.
 *       '400':
 *         description: Nenhuma alteração detectada ou dados inválidos.
 *       '404':
 *         description: Aplique não encontrado.
 *   delete:
 *     summary: Deleta um Aplique pelo ID (requer token JWT).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Apliques
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Aplique deletado com sucesso.
 *       '404':
 *         description: Aplique não encontrado.
 */
router.get('/:id', getApliqueById);
router.patch('/:id', authMiddleware, updateAplique);
router.delete('/:id', authMiddleware, deleteAplique);

export default router;
