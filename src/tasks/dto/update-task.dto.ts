import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../task.model';

export class UpdateTaskDto {
    @ApiPropertyOptional({ example: 'Estudar Kubernetes avançado' })
    title?: string;

    @ApiPropertyOptional({ example: 'Aprender sobre HPA e PVC' })
    description?: string;

    @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
    status?: TaskStatus;
}
