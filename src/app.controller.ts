import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @ApiOperation({ summary: 'Mensagem de boas-vindas' })
  @ApiResponse({ status: 200, description: 'Retorna mensagem com nome do app e timestamp' })
  getHello() {
    return this.appService.getHello();
  }

  @Get('/info')
  @ApiOperation({ summary: 'Informações da aplicação' })
  @ApiResponse({ status: 200, description: 'Retorna configurações de ambiente, versão e PID' })
  getInfo() {
    return this.appService.getInfo();
  }
}
