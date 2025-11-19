import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/persistence/database/database.module';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DashboardService } from './application/services/dashboard.service';
import { ManejadorError } from './utils/manejador-error/manejador-error';
import { JwtTenantGuard } from './presentation/guards/jwt-tenant.guard';
import { Config } from './infrastructure/config/config';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: Config.jwtKey,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController, DashboardController],
  providers: [AppService, DashboardService, ManejadorError, JwtTenantGuard],
})
export class AppModule {}
