import {
  Table,
  Column,
  DataType,
  Model,
  Default,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'tenant_planes',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class TenantPlanModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT })
  declare tenant_id: number;

  @Column({ type: DataType.BIGINT })
  declare plan_id: number | null;

  @Default('activa')
  @Column({ type: DataType.STRING(20) })
  declare estado: string;

  @Default(DataType.NOW)
  @Column({ type: DataType.DATE })
  declare fecha_inicio: Date;

  @AllowNull(false)
  @Column({ type: DataType.DATE })
  declare fecha_fin: Date;

  @Column({ type: DataType.DECIMAL(12, 2) })
  declare monto_pagado: number | null;
}

