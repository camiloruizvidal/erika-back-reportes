export interface IDashboardKpi {
  totalFacturado: number;
  totalRecaudado: number;
  ingresosErika: number;
  cuentasGeneradas: number;
  variacionFacturado: number;
  variacionRecaudado: number;
  variacionIngresosErika: number;
  variacionCuentasGeneradas: number;
}

export interface IAlertaRapida {
  tipo: 'vencen_hoy' | 'atrasados' | 'pago_parcial' | 'bloqueada';
  mensaje: string;
  cantidad: number;
}

export interface IGraficaFacturadoRecaudado {
  mes: string;
  facturado: number;
  recaudado: number;
}

export interface IGraficaPagosPorDia {
  fecha: string;
  cantidad: number;
}

export interface IClientePrincipal {
  clienteId: number;
  nombreCliente: string;
  montoTotal: number;
}

export interface IEstadoCuentas {
  pagadas: number;
  pendientes: number;
  vencidas: number;
  porcentajePagadas: number;
  porcentajePendientes: number;
  porcentajeVencidas: number;
}

export interface IUltimoMovimiento {
  id: number;
  cliente: string;
  valor: number;
  estado: string;
  fecha: Date;
  linkPago: string | null;
}

export interface IEstadoSuscripcion {
  planNombre: string;
  limiteClientes: number | null;
  limiteServicios: number | null;
  fechaRenovacion: Date | null;
  totalPagado: number;
  historicoPagos: Array<{
    fecha: Date;
    monto: number;
    referencia: string | null;
  }>;
}

export interface IDashboardData {
  kpis: IDashboardKpi;
  alertas: IAlertaRapida[];
  graficaFacturadoRecaudado: IGraficaFacturadoRecaudado[];
  graficaPagosPorDia: IGraficaPagosPorDia[];
  clientesPrincipales: IClientePrincipal[];
  estadoCuentas: IEstadoCuentas;
  ultimosMovimientos: IUltimoMovimiento[];
  estadoSuscripcion: IEstadoSuscripcion;
}

