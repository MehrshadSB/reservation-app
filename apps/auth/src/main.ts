import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "express";
import { loadAuthRuntimeConfig } from "./shared/config/platform-env";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const config = loadAuthRuntimeConfig();
  const app = await NestFactory.create(AppModule);
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.enableCors({
    origin: config.allowedRedirectOrigins,
    credentials: true,
  });
  await app.listen(config.authPort);
}

void bootstrap();
