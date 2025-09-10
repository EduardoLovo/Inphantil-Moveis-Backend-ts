import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - senha
 *               - tipo
 *             properties:
 *               usuario:
 *                 type: string
 *               senha:
 *                 type: string
 *                 format: password
 *               tipo:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Usuário registrado com sucesso.
 *       '400':
 *         description: Erro ao registrar usuário.
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Autentica usuário e retorna token JWT.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - senha
 *             properties:
 *               usuario:
 *                 type: string
 *               senha:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Login bem-sucedido.
 *       '401':
 *         description: Credenciais inválidas.
 */
router.post('/login', login);

export default router;
