import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Config } from '../../config/config';
import { CuentaCobroModel } from '../models/cuenta-cobro.model';
import { ClienteModel } from '../models/cliente.model';
import { TenantModel } from '../models/tenant.model';
import { TenantPlanModel } from '../models/tenant-plan.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: Config.dbDialect,
      host: Config.dbHost,
      port: Config.dbPuerto,
      username: Config.dbUsuario,
      password: Config.dbContrasena,
      database: Config.dbBaseDatos,
      models: [
        CuentaCobroModel,
        ClienteModel,
        TenantModel,
        TenantPlanModel,
      ],
      logging: Config.dbLogging,
      define: {
        underscored: true,
      },
    }),
  ],
})
export class DatabaseModule {}

