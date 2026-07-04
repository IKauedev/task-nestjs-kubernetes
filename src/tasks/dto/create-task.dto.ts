import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty({ example: 'Estudar Kubernetes', description: 'Título da tarefa' })
    title: string;

    @ApiProperty({ example: 'Aprender sobre pods, deployments e services', description: 'Descrição da tarefa' })
    description: string;
}
