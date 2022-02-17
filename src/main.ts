import { NestFactory } from '@nestjs/core';
import { Sequelize } from 'sequelize-typescript';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';

// modules
import { AppModule } from './app.module';

// services
import { ConfigService } from '@nestjs/config';

// interfaces
import { ConfigEnum, IConfig } from './shared/interfaces/config-enum.enum';

// helpers
import { validateEnvVariables } from './shared/helpers/validate-env-variables.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const sequelize = app.get(Sequelize);

  // Environment Variables
  const envVars: IConfig = Object.create(null);
  Object.keys(ConfigEnum).map((key: string) => {
    envVars[key] = configService.get(key);
  });
  validateEnvVariables(envVars);

  // Database
  await sequelize.sync();

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // Serve Static Files
  // TODO: check if there is more Nest.js way of serving static files
  app.use(
    '/public',
    express.static(
      join(process.cwd(), configService.get(ConfigEnum.ROOT_STORAGE_PATH)),
    ),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(
    process.env.PORT || configService.get<number>(ConfigEnum.PORT),
  );
}

bootstrap();

// TODO: Delete uploaded file from /storage on errors
