import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptors';

@Module({
  imports: [JobsModule],
  providers: [{ provide: APP_INTERCEPTOR, useClass: LoggerInterceptor }],
})
export class AppModule {}
