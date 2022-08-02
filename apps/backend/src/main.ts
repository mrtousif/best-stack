import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ClsMiddleware } from 'nestjs-cls';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';

// import underPressure from "@fastify/under-pressure";
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: {
                prettyPrint: process.env.NODE_ENV === 'development',
            },
            trustProxy: true,
        })
    );
    // app.register(underPressure, {
    //     maxEventLoopDelay: 1000,
    //     maxHeapUsedBytes: 100000000,
    //     maxRssBytes: 100000000,
    //     maxEventLoopUtilization:0.98
    // });
    app.use(
        new ClsMiddleware({
            useEnterWith: true,
        }).use
    );

    const prismaService: PrismaService = app.get(PrismaService);
    prismaService.enableShutdownHooks(app);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

    await app.listen(process.env.PORT);
}
bootstrap();
