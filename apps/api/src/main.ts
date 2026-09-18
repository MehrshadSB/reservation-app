import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { loadAuthRuntimeConfig } from "./shared/platform-env";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const config = loadAuthRuntimeConfig();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.allowedRedirectOrigins,
    credentials: true,
  });
  await app.listen(config.apiPort);
}

void bootstrap();
