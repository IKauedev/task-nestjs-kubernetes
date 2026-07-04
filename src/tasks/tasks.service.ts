import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    findAll(status?: TaskStatus): Task[] {
        if (status) {
            return this.tasks.filter((t) => t.status === status);
        }
        return this.tasks;
    }

    findOne(id: string): Task {
        const task = this.tasks.find((t) => t.id === id);
        if (!task) {
            throw new NotFoundException(`Task "${id}" not found`);
        }
        return task;
    }

    create(title: string, description: string): Task {
        const task: Task = {
            id: randomUUID(),
            title,
            description,
            status: TaskStatus.PENDING,
            createdAt: new Date().toISOString(),
        };
        this.tasks.push(task);
        return task;
    }

    update(id: string, title?: string, description?: string, status?: TaskStatus): Task {
        const task = this.findOne(id);
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        return task;
    }

    remove(id: string): void {
        const index = this.tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new NotFoundException(`Task "${id}" not found`);
        }
        this.tasks.splice(index, 1);
    }
}
