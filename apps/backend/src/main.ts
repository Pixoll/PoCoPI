import { exceptionFactory } from "@exceptions";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CatchEverythingFilter } from "./filters";
import { LoggingInterceptor } from "./interceptors";
import { LowercaseQueryKeysPipe } from "./pipes";
import * as express from 'express';
import * as bodyParser from 'body-parser';

interface TestResults { //agregar mas de ser necesario
    userId?: string;
    testId: string;
    answers: Record<string, any>;
    score?: number;
}

void async function () {
    const port = process.env.PORT ?? 3000;

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
    //Endpoint para recibir los resultados de las pruebas
    const httpAdapter = app.getHttpAdapter().getInstance();
    if(httpAdapter instanceof express.Application) {
        httpAdapter.post('/api/raven-results', (req, res) => {
            const testResults: TestResults = req.body;

            logger.debug('Resultados recibidos:', testResults);
            res.status(200).json({ message: 'Resultados recibidos y procesados correctamente.' });

            data: testResults
        });
    }

}
    




    const appUrl = await app.getUrl()
        .then(url => url.replace("[::1]", "localhost").replace(/\/$/, "") + "/" + globalPrefix);

    logger.log(`Application is running at ${appUrl}`);

    app.use(bodyParser.json());
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);    

    });

app.post('/api/results', (req, res) => {
    const testResults = req.body; // Aquí obtenemos los datos enviados desde el frontend
  
    console.log('Resultados recibidos:', testResults);
  
    res.status(200).json({ message: 'Resultados recibidos y procesados correctamente.' });
  });


 