import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    @ApiOperation({ summary: 'Listar todas as tarefas' })
    @ApiQuery({ name: 'status', enum: TaskStatus, required: false, description: 'Filtrar por status' })
    @ApiResponse({ status: 200, description: 'Lista de tarefas' })
    findAll(@Query('status') status?: TaskStatus) {
        return this.tasksService.findAll(status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar tarefa por ID' })
    @ApiParam({ name: 'id', description: 'UUID da tarefa' })
    @ApiResponse({ status: 200, description: 'Tarefa encontrada' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Criar nova tarefa' })
    @ApiResponse({ status: 201, description: 'Tarefa criada com sucesso' })
    create(@Body() body: CreateTaskDto) {
        return this.tasksService.create(body.title, body.description);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualizar tarefa' })
    @ApiParam({ name: 'id', description: 'UUID da tarefa' })
    @ApiResponse({ status: 200, description: 'Tarefa atualizada' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
        return this.tasksService.update(id, body.title, body.description, body.status);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Remover tarefa' })
    @ApiParam({ name: 'id', description: 'UUID da tarefa' })
    @ApiResponse({ status: 204, description: 'Tarefa removida' })
    @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
    remove(@Param('id') id: string) {
        this.tasksService.remove(id);
    }
}
