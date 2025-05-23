import { exceptionFactory } from "@exceptions";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CatchEverythingFilter } from "./filters";
import { LoggingInterceptor } from "./interceptors";
import { LowercaseQueryKeysPipe } from "./pipes";

void async function () {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ["debug"],
    });

    const logger = new Logger("PoCoPIApp");

    const globalPrefix = "api";

    app.getHttpAdapter().getInstance().disable("x-powered-by");

    app.setGlobalPrefix(globalPrefix)
        .useGlobalFilters(new CatchEverythingFilter())
        .useGlobalInterceptors(new LoggingInterceptor())
        .useGlobalPipes(
            new LowercaseQueryKeysPipe(),
            new ValidationPipe({
                exceptionFactory,
                forbidNonWhitelisted: true,
                stopAtFirstError: true,
                transform: true,
                whitelist: true,
            })
        );

    const swaggerConfig = new DocumentBuilder()
        .setTitle("PoCoPI - Proof of Concept Psycho-Informatics - API")
        .addServer(globalPrefix)
        .build();

    SwaggerModule.setup(globalPrefix, app, () => SwaggerModule.createDocument(app, swaggerConfig, {
        ignoreGlobalPrefix: true,
    }));

    await app.listen(process.env.PORT ?? 3000);

    const appUrl = await app.getUrl()
        .then(url => url.replace("[::1]", "localhost").replace(/\/$/, "") + "/" + globalPrefix);

    logger.log(`Application is running at ${appUrl}`);
}();
