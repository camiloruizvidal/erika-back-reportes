import { Op, Sequelize } from 'sequelize';
import moment from 'moment-timezone';
import { CuentaCobroModel } from '../models/cuenta-cobro.model';
import { ClienteModel } from '../models/cliente.model';
import { TenantModel } from '../models/tenant.model';
import { TenantPlanModel } from '../models/tenant-plan.model';
import { EEstadoCuentaCobro } from '../../../domain/enums/estado-cuenta-cobro.enum';
import { Transformador } from '../../../utils/transformador.util';
import {
  IDashboardKpi,
  IAlertaRapida,
  IGraficaFacturadoRecaudado,
  IGraficaPagosPorDia,
  IClientePrincipal,
  IEstadoCuentas,
  IUltimoMovimiento,
  IEstadoSuscripcion,
} from '../../../shared/interfaces/dashboard.interface';

export class DashboardRepository {
  static async obtenerKpis(
    tenantId: number,
    fechaInicioMesActual: Date,
    fechaFinMesActual: Date,
    fechaInicioMesAnterior: Date,
    fechaFinMesAnterior: Date,
  ): Promise<IDashboardKpi> {
    const mesActual = await CuentaCobroModel.findAll({
      where: {
        [Op.and]: [
          { tenantId },
          Sequelize.where(Sequelize.col('created_at'), Op.between, [fechaInicioMesActual, fechaFinMesActual]),
        ],
      },
      attributes: [
        [
          Sequelize.fn('SUM', Sequelize.col('valor_total')),
          'totalFacturado',
        ],
        [
          Sequelize.fn('SUM', Sequelize.col('valor_pagado')),
          'totalRecaudado',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cuentasGeneradas'],
      ],
      raw: true,
    });

    const mesAnterior = await CuentaCobroModel.findAll({
      where: {
        [Op.and]: [
          { tenantId },
          Sequelize.where(Sequelize.col('created_at'), Op.between, [fechaInicioMesAnterior, fechaFinMesAnterior]),
        ],
      },
      attributes: [
        [
          Sequelize.fn('SUM', Sequelize.col('valor_total')),
          'totalFacturado',
        ],
        [
          Sequelize.fn('SUM', Sequelize.col('valor_pagado')),
          'totalRecaudado',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cuentasGeneradas'],
      ],
      raw: true,
    });

    const mesActualData = mesActual[0] as any;
    const mesAnteriorData = mesAnterior[0] as any;

    const totalFacturadoActual =
      Number(mesActualData?.totalFacturado) || 0;
    const totalRecaudadoActual =
      Number(mesActualData?.totalRecaudado) || 0;
    const cuentasGeneradasActual =
      Number(mesActualData?.cuentasGeneradas) || 0;

    const totalFacturadoAnterior =
      Number(mesAnteriorData?.totalFacturado) || 0;
    const totalRecaudadoAnterior =
      Number(mesAnteriorData?.totalRecaudado) || 0;
    const cuentasGeneradasAnterior =
      Number(mesAnteriorData?.cuentasGeneradas) || 0;

    const comisionErika = totalRecaudadoActual * 0.1;
    const suscripciones = await this.obtenerTotalSuscripciones(
      tenantId,
      fechaInicioMesActual,
      fechaFinMesActual,
    );
    const ingresosErikaActual = comisionErika + suscripciones;

    const comisionErikaAnterior = totalRecaudadoAnterior * 0.1;
    const suscripcionesAnterior = await this.obtenerTotalSuscripciones(
      tenantId,
      fechaInicioMesAnterior,
      fechaFinMesAnterior,
    );
    const ingresosErikaAnterior = comisionErikaAnterior + suscripcionesAnterior;

    const variacionFacturado =
      totalFacturadoAnterior > 0
        ? ((totalFacturadoActual - totalFacturadoAnterior) /
            totalFacturadoAnterior) *
          100
        : 0;

    const variacionRecaudado =
      totalRecaudadoAnterior > 0
        ? ((totalRecaudadoActual - totalRecaudadoAnterior) /
            totalRecaudadoAnterior) *
          100
        : 0;

    const variacionIngresosErika =
      ingresosErikaAnterior > 0
        ? ((ingresosErikaActual - ingresosErikaAnterior) /
            ingresosErikaAnterior) *
          100
        : 0;

    const variacionCuentasGeneradas =
      cuentasGeneradasAnterior > 0
        ? ((cuentasGeneradasActual - cuentasGeneradasAnterior) /
            cuentasGeneradasAnterior) *
          100
        : 0;

    return {
      totalFacturado: totalFacturadoActual,
      totalRecaudado: totalRecaudadoActual,
      ingresosErika: ingresosErikaActual,
      cuentasGeneradas: cuentasGeneradasActual,
      variacionFacturado,
      variacionRecaudado,
      variacionIngresosErika,
      variacionCuentasGeneradas,
    };
  }

  static async obtenerAlertas(tenantId: number): Promise<IAlertaRapida[]> {
    const hoy = moment().startOf('day').toDate();
    const hace15Dias = moment().subtract(15, 'days').startOf('day').toDate();

    const cuentasVencenHoy = await CuentaCobroModel.count({
      where: {
        tenantId,
        fechaCobro: {
          [Op.lte]: hoy,
        },
        estado: EEstadoCuentaCobro.PENDIENTE,
      },
    });

    const clientesAtrasados = await CuentaCobroModel.count({
      where: {
        tenantId,
        fechaCobro: {
          [Op.lte]: hace15Dias,
        },
        estado: EEstadoCuentaCobro.MORA,
      },
      distinct: true,
      col: 'cliente_id',
    });

    const alertas: IAlertaRapida[] = [];

    if (cuentasVencenHoy > 0) {
      alertas.push({
        tipo: 'vencen_hoy',
        mensaje: `${cuentasVencenHoy} cuenta${cuentasVencenHoy > 1 ? 's' : ''} vence${cuentasVencenHoy > 1 ? 'n' : ''} hoy`,
        cantidad: cuentasVencenHoy,
      });
    }

    if (clientesAtrasados > 0) {
      alertas.push({
        tipo: 'atrasados',
        mensaje: `${clientesAtrasados} cliente${clientesAtrasados > 1 ? 's' : ''} está${clientesAtrasados > 1 ? 'n' : ''} atrasado${clientesAtrasados > 1 ? 's' : ''} más de 15 días`,
        cantidad: clientesAtrasados,
      });
    }

    return alertas;
  }

  static async obtenerGraficaFacturadoRecaudado(
    tenantId: number,
    meses: number = 6,
  ): Promise<IGraficaFacturadoRecaudado[]> {
    const resultados: IGraficaFacturadoRecaudado[] = [];

    for (let i = meses - 1; i >= 0; i--) {
      const fechaInicio = moment()
        .subtract(i, 'months')
        .startOf('month')
        .toDate();
      const fechaFin = moment()
        .subtract(i, 'months')
        .endOf('month')
        .toDate();

      const datos = await CuentaCobroModel.findAll({
        where: {
          [Op.and]: [
            { tenantId },
            Sequelize.where(Sequelize.col('created_at'), Op.between, [fechaInicio, fechaFin]),
          ],
        },
        attributes: [
          [
            Sequelize.fn('SUM', Sequelize.col('valor_total')),
            'facturado',
          ],
          [
            Sequelize.fn('SUM', Sequelize.col('valor_pagado')),
            'recaudado',
          ],
        ],
        raw: true,
      });

      const datosData = datos[0] as any;
      resultados.push({
        mes: moment(fechaInicio).format('YYYY-MM'),
        facturado: Number(datosData?.facturado) || 0,
        recaudado: Number(datosData?.recaudado) || 0,
      });
    }

    return resultados;
  }

  static async obtenerGraficaPagosPorDia(
    tenantId: number,
    dias: number = 30,
  ): Promise<IGraficaPagosPorDia[]> {
    const fechaInicio = moment().subtract(dias, 'days').startOf('day').toDate();

    const pagos = await CuentaCobroModel.findAll({
      where: {
        tenantId,
        estado: EEstadoCuentaCobro.PAGADA,
        fechaPago: {
          [Op.gte]: fechaInicio,
        },
      },
      attributes: [
        [
          Sequelize.fn('DATE', Sequelize.col('fecha_pago')),
          'fecha',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad'],
      ],
      group: [Sequelize.fn('DATE', Sequelize.col('fecha_pago'))],
      raw: true,
      order: [[Sequelize.fn('DATE', Sequelize.col('fecha_pago')), 'ASC']],
    });

    return pagos.map((pago: any) => ({
      fecha: moment(pago.fecha).format('YYYY-MM-DD'),
      cantidad: Number(pago.cantidad) || 0,
    }));
  }

  static async obtenerClientesPrincipales(
    tenantId: number,
    limite: number = 10,
  ): Promise<IClientePrincipal[]> {
    const clientes = await CuentaCobroModel.findAll({
      where: {
        tenantId,
        estado: EEstadoCuentaCobro.PAGADA,
        valorPagado: {
          [Op.not]: null,
        },
      },
      include: [
        {
          model: ClienteModel,
          attributes: ['id', 'nombreCompleto'],
        },
      ],
      attributes: [
        'clienteId',
        [
          Sequelize.fn('SUM', Sequelize.col('valor_pagado')),
          'montoTotal',
        ],
      ],
      group: ['clienteId', 'cliente.id', 'cliente.nombre_completo'],
      order: [[Sequelize.fn('SUM', Sequelize.col('valor_pagado')), 'DESC']],
      limit: limite,
      raw: true,
      nest: true,
    });

    return clientes.map((cliente: any) => ({
      clienteId: cliente.clienteId,
      nombreCliente: cliente.cliente?.nombreCompleto || 'Sin nombre',
      montoTotal: Number(cliente.montoTotal) || 0,
    }));
  }

  static async obtenerEstadoCuentas(
    tenantId: number,
  ): Promise<IEstadoCuentas> {
    const estado = await CuentaCobroModel.findAll({
      where: {
        tenantId,
      },
      attributes: [
        'estado',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad'],
      ],
      group: ['estado'],
      raw: true,
    });

    const estadoData = estado as any[];
    const pagadas =
      Number(
        estadoData.find((e) => e.estado === EEstadoCuentaCobro.PAGADA)
          ?.cantidad,
      ) || 0;
    const pendientes =
      Number(
        estadoData.find((e) => e.estado === EEstadoCuentaCobro.PENDIENTE)
          ?.cantidad,
      ) || 0;
    const vencidas =
      Number(
        estadoData.find((e) => e.estado === EEstadoCuentaCobro.MORA)
          ?.cantidad,
      ) || 0;

    const total = pagadas + pendientes + vencidas;

    return {
      pagadas,
      pendientes,
      vencidas,
      porcentajePagadas: total > 0 ? (pagadas / total) * 100 : 0,
      porcentajePendientes: total > 0 ? (pendientes / total) * 100 : 0,
      porcentajeVencidas: total > 0 ? (vencidas / total) * 100 : 0,
    };
  }

  static async obtenerUltimosMovimientos(
    tenantId: number,
    limite: number = 15,
  ): Promise<IUltimoMovimiento[]> {
    const movimientos = await CuentaCobroModel.findAll({
      where: {
        tenantId,
      },
      include: [
        {
          model: ClienteModel,
          attributes: ['nombreCompleto'],
        },
      ],
      attributes: [
        'id',
        'valorTotal',
        'estado',
        [Sequelize.col('CuentaCobroModel.created_at'), 'createdAt'],
        'linkPago',
      ],
      order: [[Sequelize.col('CuentaCobroModel.created_at'), 'DESC']],
      limit: limite,
    });

    const movimientosTransformados = Transformador.extraerDataValues<any[]>(
      movimientos,
    );

    return movimientosTransformados.map((movimiento: any) => ({
      id: movimiento.id,
      cliente: movimiento.cliente?.nombreCompleto || 'Sin nombre',
      valor: Number(movimiento.valorTotal) || 0,
      estado: movimiento.estado,
      fecha: movimiento.createdAt,
      linkPago: movimiento.linkPago,
    }));
  }

  static async obtenerEstadoSuscripcion(
    tenantId: number,
  ): Promise<IEstadoSuscripcion> {
    const tenant = await TenantModel.findByPk(tenantId);

    const planActivo = await TenantPlanModel.findOne({
      where: {
        tenant_id: tenantId,
        estado: 'activa',
      },
      order: [['created_at', 'DESC']],
    });

    const planes = await TenantPlanModel.findAll({
      where: {
        tenant_id: tenantId,
      },
      order: [['created_at', 'DESC']],
    });

    const totalPagado = planes.reduce(
      (sum, plan) => sum + (Number(plan.monto_pagado) || 0),
      0,
    );

    const historicoPagos = planes.map((plan) => ({
      fecha: plan.createdAt || plan.getDataValue('created_at'),
      monto: Number(plan.monto_pagado) || 0,
      referencia: null,
    }));

    return {
      planNombre: tenant?.plan_nombre_cache || 'Sin plan',
      limiteClientes: null,
      limiteServicios: null,
      fechaRenovacion: planActivo?.fecha_fin || null,
      totalPagado,
      historicoPagos,
    };
  }

  private static async obtenerTotalSuscripciones(
    tenantId: number,
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<number> {
    const suscripciones = await TenantPlanModel.findAll({
      where: {
        tenant_id: tenantId,
        created_at: {
          [Op.between]: [fechaInicio, fechaFin],
        },
      },
      attributes: [
        [
          Sequelize.fn('SUM', Sequelize.col('monto_pagado')),
          'total',
        ],
      ],
      raw: true,
    });

    const suscripcionesData = suscripciones[0] as any;
    return Number(suscripcionesData?.total) || 0;
  }
}

