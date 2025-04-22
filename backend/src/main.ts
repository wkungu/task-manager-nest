import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useLogger(['log', 'debug', 'error', 'verbose', 'warn']); // optional
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for the Task Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // Name of the security scheme (used later in Swagger options)
    ) // Enable JWT in Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      url: '/docs-json',
      persistAuthorization: true, // ✅ Keeps your JWT token across page reloads
      defaultModelsExpandDepth: -1, // 🔒 Hides annoying model schemas by default
      docExpansion: 'none', // Collapses all sections initially
      displayRequestDuration: true,
      tryItOutEnabled: true, // 👈 Makes Try It Out available by default
      filter: true, // Adds a search bar
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  }); // Swagger UI at /api

  app.use('/docs-json', (req, res) => res.json(document));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
