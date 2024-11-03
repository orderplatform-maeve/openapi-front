import * as http from 'http';
import { NextApiHandler } from 'next';
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ApiModule } from '@/api/api.module';

let app: INestApplication;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(ApiModule, { bodyParser: false });
    app.setGlobalPrefix('api');

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
