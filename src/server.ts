import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/auth.routes';
import sinteticoRoutes from './routes/sintetico.routes';
import apliquesRoutes from './routes/apliques.routes';
import lencolProntaEntregasRoutes from './routes/lencolprontaentregas.routes';
import tecidoParaLencol from './routes/tecidoparalencol.routes';
import pantone from './routes/pantone.routes';

dotenv.config();
const app = express();
const port = 3000;

// Configuração básica do CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // URL do frontend (React, por exemplo)
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());

// Swagger
setupSwagger(app);

app.get('/', async (req, res) => {
    res.send('API Inphantil!');
});

app.use('/auth', authRoutes);
app.use('/sintetico', sinteticoRoutes);
app.use('/apliques', apliquesRoutes);
app.use('/lencol-pronta-entrega', lencolProntaEntregasRoutes);
app.use('/tecido-para-lencol', tecidoParaLencol);
app.use('/pantones', pantone);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
