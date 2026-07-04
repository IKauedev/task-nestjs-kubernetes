import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthService } from './health/health.service';
import { HealthController } from './health/health.controller';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [ConfigModule.forRoot(), TasksModule],
  controllers: [AppController, HealthController],
  providers: [AppService, HealthService],
})
export class AppModule { }
