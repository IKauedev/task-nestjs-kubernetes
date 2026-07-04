import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) { }

  @Get('/healthz')
  @ApiOperation({ summary: 'Liveness probe', description: 'Usado pelo Kubernetes para verificar se o processo está vivo' })
  @ApiResponse({ status: 200, description: 'Aplicação está viva' })
  healthz() {
    return this.healthService.checkHealth();
  }

  @Get('/readyz')
  @ApiOperation({ summary: 'Readiness probe', description: 'Usado pelo Kubernetes para verificar se a aplicação está pronta para receber tráfego' })
  @ApiResponse({ status: 200, description: 'Aplicação pronta' })
  @ApiResponse({ status: 503, description: 'Aplicação não pronta (memória alta ou ainda inicializando)' })
  readyz(@Res() res: Response) {
    const result = this.healthService.checkReady();
    const status = result.ready ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(result);
  }

  @Get('/health')
  @ApiOperation({ summary: 'Status detalhado', description: 'Retorna métricas de memória, uptime, CPU e informações do sistema' })
  @ApiResponse({ status: 200, description: 'Detalhes completos de saúde da aplicação' })
  health() {
    return this.healthService.getStatus();
  }
}
