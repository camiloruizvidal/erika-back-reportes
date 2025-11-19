import { Injectable } from '@nestjs/common';
import moment from 'moment-timezone';
import { DashboardRepository } from '../../infrastructure/persistence/repositories/dashboard.repository';
import { IDashboardData } from '../../shared/interfaces/dashboard.interface';

@Injectable()
export class DashboardService {
  async obtenerDashboard(tenantId: number): Promise<IDashboardData> {
    const fechaInicioMesActual = moment()
      .startOf('month')
      .startOf('day')
      .toDate();
    const fechaFinMesActual = moment().endOf('month').endOf('day').toDate();

    const fechaInicioMesAnterior = moment()
      .subtract(1, 'month')
      .startOf('month')
      .startOf('day')
      .toDate();
    const fechaFinMesAnterior = moment()
      .subtract(1, 'month')
      .endOf('month')
      .endOf('day')
      .toDate();

    const [
      kpis,
      alertas,
      graficaFacturadoRecaudado,
      graficaPagosPorDia,
      clientesPrincipales,
      estadoCuentas,
      ultimosMovimientos,
      estadoSuscripcion,
    ] = await Promise.all([
      DashboardRepository.obtenerKpis(
        tenantId,
        fechaInicioMesActual,
        fechaFinMesActual,
        fechaInicioMesAnterior,
        fechaFinMesAnterior,
      ),
      DashboardRepository.obtenerAlertas(tenantId),
      DashboardRepository.obtenerGraficaFacturadoRecaudado(tenantId, 6),
      DashboardRepository.obtenerGraficaPagosPorDia(tenantId, 30),
      DashboardRepository.obtenerClientesPrincipales(tenantId, 10),
      DashboardRepository.obtenerEstadoCuentas(tenantId),
      DashboardRepository.obtenerUltimosMovimientos(tenantId, 15),
      DashboardRepository.obtenerEstadoSuscripcion(tenantId),
    ]);

    return {
      kpis,
      alertas,
      graficaFacturadoRecaudado,
      graficaPagosPorDia,
      clientesPrincipales,
      estadoCuentas,
      ultimosMovimientos,
      estadoSuscripcion,
    };
  }
}

