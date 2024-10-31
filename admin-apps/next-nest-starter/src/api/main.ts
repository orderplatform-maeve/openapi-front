import * as http from 'http';
import { NextApiHandler } from 'next';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ApiModule } from '@/api/api.module';

let app: INestApplication;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(ApiModule, { bodyParser: false });
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('admin-app starter Swagger example')
      .setDescription('관리자 BFF 용 Swagger 입니다.')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/swagger', app, documentFactory);

    await app.init();
  }

  return app;
}

export async function getListener() {
  const app = await getApp();
  const server: http.Server = app.getHttpServer();
  const [listener] = server.listeners('request') as NextApiHandler[];
  return listener;
}
