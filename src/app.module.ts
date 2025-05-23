import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptors';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JobsModule,
    ConfigModule.forRoot({
      envFilePath: ['.dev.env', '.env'],
      cache: true,
      expandVariables: true,
      isGlobal: true,
    }),
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor }],
})
export class AppModule {}
