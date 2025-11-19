import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EEstadoCuentaCobro } from '../../../domain/enums/estado-cuenta-cobro.enum';
import { ClienteModel } from './cliente.model';

@Table({
  tableName: 'cuentas_cobro',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class CuentaCobroModel extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'tenant_id' })
  declare tenantId: number;

  @ForeignKey(() => ClienteModel)
  @AllowNull(false)
  @Column({ type: DataType.BIGINT, field: 'cliente_id' })
  declare clienteId: number;

  @AllowNull(false)
  @Column({ type: DataType.DATE, field: 'fecha_cobro' })
  declare fechaCobro: Date;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'valor_total',
  })
  declare valorTotal: number;

  @Default(EEstadoCuentaCobro.PENDIENTE)
  @AllowNull(false)
  @Column({ type: DataType.STRING(20) })
  declare estado: EEstadoCuentaCobro;

  @AllowNull(true)
  @Column({ type: DataType.DATE, field: 'fecha_pago' })
  declare fechaPago: Date | null;

  @AllowNull(true)
  @Column({
    type: DataType.DECIMAL(12, 2),
    field: 'valor_pagado',
  })
  declare valorPagado: number | null;

  @AllowNull(true)
  @Column({ type: DataType.TEXT, field: 'link_pago' })
  declare linkPago: string | null;

  @BelongsTo(() => ClienteModel)
  cliente?: ClienteModel;
}

