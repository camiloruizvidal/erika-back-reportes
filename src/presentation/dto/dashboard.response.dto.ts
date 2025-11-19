import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DashboardKpiDto {
  @ApiProperty({ description: 'Total facturado en el mes actual', type: Number })
  @Expose({ name: 'totalFacturado' })
  total_facturado!: number;

  @ApiProperty({ description: 'Total recaudado en el mes actual', type: Number })
  @Expose({ name: 'totalRecaudado' })
  total_recaudado!: number;

  @ApiProperty({ description: 'Ingresos de Erika (comisiones + suscripciones)', type: Number })
  @Expose({ name: 'ingresosErika' })
  ingresos_erika!: number;

  @ApiProperty({ description: 'Cantidad de cuentas generadas en el mes', type: Number })
  @Expose({ name: 'cuentasGeneradas' })
  cuentas_generadas!: number;

  @ApiProperty({ description: 'Variación porcentual del total facturado', type: Number })
  @Expose({ name: 'variacionFacturado' })
  variacion_facturado!: number;

  @ApiProperty({ description: 'Variación porcentual del total recaudado', type: Number })
  @Expose({ name: 'variacionRecaudado' })
  variacion_recaudado!: number;

  @ApiProperty({ description: 'Variación porcentual de ingresos de Erika', type: Number })
  @Expose({ name: 'variacionIngresosErika' })
  variacion_ingresos_erika!: number;

  @ApiProperty({ description: 'Variación porcentual de cuentas generadas', type: Number })
  @Expose({ name: 'variacionCuentasGeneradas' })
  variacion_cuentas_generadas!: number;
}

export class AlertaRapidaDto {
  @ApiProperty({ description: 'Tipo de alerta', enum: ['vencen_hoy', 'atrasados', 'pago_parcial', 'bloqueada'] })
  @Expose()
  tipo!: string;

  @ApiProperty({ description: 'Mensaje de la alerta', type: String })
  @Expose()
  mensaje!: string;

  @ApiProperty({ description: 'Cantidad relacionada con la alerta', type: Number })
  @Expose()
  cantidad!: number;
}

export class GraficaFacturadoRecaudadoDto {
  @ApiProperty({ description: 'Mes en formato YYYY-MM', type: String })
  @Expose()
  mes!: string;

  @ApiProperty({ description: 'Monto facturado en el mes', type: Number })
  @Expose()
  facturado!: number;

  @ApiProperty({ description: 'Monto recaudado en el mes', type: Number })
  @Expose()
  recaudado!: number;
}

export class GraficaPagosPorDiaDto {
  @ApiProperty({ description: 'Fecha en formato YYYY-MM-DD', type: String })
  @Expose()
  fecha!: string;

  @ApiProperty({ description: 'Cantidad de pagos en el día', type: Number })
  @Expose()
  cantidad!: number;
}

export class ClientePrincipalDto {
  @ApiProperty({ description: 'ID del cliente', type: Number })
  @Expose({ name: 'clienteId' })
  cliente_id!: number;

  @ApiProperty({ description: 'Nombre completo del cliente', type: String })
  @Expose({ name: 'nombreCliente' })
  nombre_cliente!: string;

  @ApiProperty({ description: 'Monto total pagado por el cliente', type: Number })
  @Expose({ name: 'montoTotal' })
  monto_total!: number;
}

export class EstadoCuentasDto {
  @ApiProperty({ description: 'Cantidad de cuentas pagadas', type: Number })
  @Expose()
  pagadas!: number;

  @ApiProperty({ description: 'Cantidad de cuentas pendientes', type: Number })
  @Expose()
  pendientes!: number;

  @ApiProperty({ description: 'Cantidad de cuentas vencidas', type: Number })
  @Expose()
  vencidas!: number;

  @ApiProperty({ description: 'Porcentaje de cuentas pagadas', type: Number })
  @Expose()
  porcentaje_pagadas!: number;

  @ApiProperty({ description: 'Porcentaje de cuentas pendientes', type: Number })
  @Expose()
  porcentaje_pendientes!: number;

  @ApiProperty({ description: 'Porcentaje de cuentas vencidas', type: Number })
  @Expose()
  porcentaje_vencidas!: number;
}

export class UltimoMovimientoDto {
  @ApiProperty({ description: 'ID de la cuenta de cobro', type: Number })
  @Expose()
  id!: number;

  @ApiProperty({ description: 'Nombre del cliente', type: String })
  @Expose()
  cliente!: string;

  @ApiProperty({ description: 'Valor de la cuenta de cobro', type: Number })
  @Expose()
  valor!: number;

  @ApiProperty({ description: 'Estado de la cuenta', type: String })
  @Expose()
  estado!: string;

  @ApiProperty({ description: 'Fecha de creación', type: Date })
  @Expose()
  fecha!: Date;

  @ApiProperty({ description: 'Link de pago (si existe)', type: String, nullable: true })
  @Expose()
  link_pago!: string | null;
}

export class HistoricoPagoDto {
  @ApiProperty({ description: 'Fecha del pago', type: Date })
  @Expose()
  fecha!: Date;

  @ApiProperty({ description: 'Monto pagado', type: Number })
  @Expose()
  monto!: number;

  @ApiProperty({ description: 'Referencia de pago', type: String, nullable: true })
  @Expose()
  referencia!: string | null;
}

export class EstadoSuscripcionDto {
  @ApiProperty({ description: 'Nombre del plan', type: String })
  @Expose({ name: 'planNombre' })
  plan_nombre!: string;

  @ApiProperty({ description: 'Límite de clientes', type: Number, nullable: true })
  @Expose({ name: 'limiteClientes' })
  limite_clientes!: number | null;

  @ApiProperty({ description: 'Límite de servicios', type: Number, nullable: true })
  @Expose({ name: 'limiteServicios' })
  limite_servicios!: number | null;

  @ApiProperty({ description: 'Fecha de renovación', type: Date, nullable: true })
  @Expose({ name: 'fechaRenovacion' })
  fecha_renovacion!: Date | null;

  @ApiProperty({ description: 'Total pagado a Erika', type: Number })
  @Expose({ name: 'totalPagado' })
  total_pagado!: number;

  @ApiProperty({ description: 'Histórico de pagos', type: [HistoricoPagoDto] })
  @Expose({ name: 'historicoPagos' })
  historico_pagos!: HistoricoPagoDto[];
}

export class DashboardResponseDto {
  @ApiProperty({ description: 'KPIs principales', type: DashboardKpiDto })
  @Expose()
  kpis!: DashboardKpiDto;

  @ApiProperty({ description: 'Alertas rápidas', type: [AlertaRapidaDto] })
  @Expose()
  alertas!: AlertaRapidaDto[];

  @ApiProperty({ description: 'Gráfica de facturado vs recaudado', type: [GraficaFacturadoRecaudadoDto] })
  @Expose({ name: 'graficaFacturadoRecaudado' })
  grafica_facturado_recaudado!: GraficaFacturadoRecaudadoDto[];

  @ApiProperty({ description: 'Gráfica de pagos por día', type: [GraficaPagosPorDiaDto] })
  @Expose({ name: 'graficaPagosPorDia' })
  grafica_pagos_por_dia!: GraficaPagosPorDiaDto[];

  @ApiProperty({ description: 'Clientes principales', type: [ClientePrincipalDto] })
  @Expose({ name: 'clientesPrincipales' })
  clientes_principales!: ClientePrincipalDto[];

  @ApiProperty({ description: 'Estado de cuentas', type: EstadoCuentasDto })
  @Expose({ name: 'estadoCuentas' })
  estado_cuentas!: EstadoCuentasDto;

  @ApiProperty({ description: 'Últimos movimientos', type: [UltimoMovimientoDto] })
  @Expose({ name: 'ultimosMovimientos' })
  ultimos_movimientos!: UltimoMovimientoDto[];

  @ApiProperty({ description: 'Estado de suscripción', type: EstadoSuscripcionDto })
  @Expose({ name: 'estadoSuscripcion' })
  estado_suscripcion!: EstadoSuscripcionDto;
}

