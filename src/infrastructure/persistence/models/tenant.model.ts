import {
  Table,
  Column,
  DataType,
  Model,
  AllowNull,
  HasMany,
} from 'sequelize-typescript';
import { TenantPlanModel } from './tenant-plan.model';

@Table({
  tableName: 'tenants',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class TenantModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(150) })
  declare nombre: string;

  @Column({ type: DataType.BIGINT })
  declare plan_activo_id: number | null;

  @Column({ type: DataType.STRING(50) })
  declare plan_nombre_cache: string | null;

  @HasMany(() => TenantPlanModel, 'tenant_id')
  planes?: TenantPlanModel[];
}

