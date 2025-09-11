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

// Import do Prisma Client
import { PrismaClient } from '@prisma/client';

// Evite múltiplas instâncias do Prisma Client em produção
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // permite requests sem origin (ex: Postman)

            // Permite localhost (qualquer porta)
            if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }

            // Permite qualquer domínio do Vercel (*.vercel.app)
            if (/\.vercel\.app$/.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'), false);
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger - apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
}

app.get('/', async (req, res) => {
    res.send('API Inphantil!');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/auth', authRoutes);
app.use('/sintetico', sinteticoRoutes);
app.use('/apliques', apliquesRoutes);
app.use('/lencol-pronta-entrega', lencolProntaEntregasRoutes);
app.use('/tecido-para-lencol', tecidoParaLencol);
app.use('/pantones', pantone);

// Export para o Vercel
export default app;

// Inicia o servidor apenas em desenvolvimento local
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}
