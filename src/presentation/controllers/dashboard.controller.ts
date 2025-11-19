import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import type { Request } from 'express';
import { DashboardService } from '../../application/services/dashboard.service';
import { DashboardResponseDto } from '../dto/dashboard.response.dto';
import { JwtTenantGuard } from '../guards/jwt-tenant.guard';
import { ManejadorError } from '../../utils/manejador-error/manejador-error';

interface RequestConTenant extends Request {
  tenantId: number;
}

@ApiTags('Dashboard')
@Controller('api/v1/reportes')
export class DashboardController {
  private readonly logger = new Logger(DashboardController.name);

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly manejadorError: ManejadorError,
  ) {}

  @Get('dashboard')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtTenantGuard)
  @ApiOperation({
    summary: 'Obtener datos del dashboard',
    description:
      'Obtiene todos los datos necesarios para mostrar el dashboard: KPIs, alertas, gráficas, estado de cuentas, últimos movimientos y estado de suscripción',
  })
  @ApiOkResponse({
    description: 'Datos del dashboard obtenidos exitosamente',
    type: DashboardResponseDto,
  })
  async obtenerDashboard(
    @Req() request: RequestConTenant,
  ): Promise<DashboardResponseDto> {
    try {
      const tenantId = request.tenantId;
      const datos = await this.dashboardService.obtenerDashboard(tenantId);

      return plainToInstance(DashboardResponseDto, datos, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error({ error: JSON.stringify(error) });
      this.manejadorError.resolverErrorApi(error);
    }
  }
}

