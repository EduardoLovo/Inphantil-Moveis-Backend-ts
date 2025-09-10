import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import path from 'path';

export function setupSwagger(app: Express) {
    const options: swaggerJsdoc.Options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'API Inphantil',
                version: '1.0.0',
                description: 'Documentação da API com Swagger',
            },
        },
        // Inclui .ts e .js (caso buildado). Usa path.join para funcionar no Windows.
        apis: [
            path.join(__dirname, '../routes/**/*.ts'),
            path.join(__dirname, '../routes/**/*.js'),
        ],
    };

    const swaggerSpec = swaggerJsdoc(options);

    // Endpoint JSON para debug
    app.get('/docs-json', (_req, res) => {
        res.json(swaggerSpec);
    });

    // UI
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
