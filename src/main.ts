import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";

require("dotenv").config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000"
  });

  const options = new DocumentBuilder()
    .setTitle("To-Do list with Nest.js")
    .setDescription("To-Do list API description")
    .setVersion("1.0")
    .build();

  const commonDocument = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, commonDocument);

  await app.listen(process.env.PORT || 5000);

}

bootstrap();
