import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser()); 
  const fe = configService.get("FE_URL");

  app.enableCors({
    origin: fe, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  });
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");
  const port = configService.get("PORT");
  console.log(port)
  await app.listen(port);
}
bootstrap();
