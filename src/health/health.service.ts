import { Injectable } from '@nestjs/common';
import * as os from 'os';

const MAX_HEAP_USAGE_RATIO = 0.90;
const MIN_UPTIME_SECONDS = 5;

@Injectable()
export class HealthService {
  private readonly startedAt = new Date().toISOString();

  checkHealth(): { status: string; uptime: number; timestamp: string } {
    return {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  checkReady(): { status: string; ready: boolean; reason?: string } {
    const mem = process.memoryUsage();
    const heapRatio = mem.heapUsed / mem.heapTotal;

    if (process.uptime() < MIN_UPTIME_SECONDS) {
      return { status: 'not_ready', ready: false, reason: 'application is still starting' };
    }

    if (heapRatio > MAX_HEAP_USAGE_RATIO) {
      return { status: 'not_ready', ready: false, reason: 'memory pressure too high' };
    }

    return { status: 'ready', ready: true };
  }

  getStatus() {
    const mem = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      startedAt: this.startedAt,
      uptime: {
        seconds: Math.floor(process.uptime()),
        human: this.formatUptime(process.uptime()),
      },
      process: {
        pid: process.pid,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
      },
      memory: {
        heap: {
          used: this.toMB(mem.heapUsed),
          total: this.toMB(mem.heapTotal),
          usagePercent: Number(((mem.heapUsed / mem.heapTotal) * 100).toFixed(1)),
        },
        rss: this.toMB(mem.rss),
        external: this.toMB(mem.external),
      },
      system: {
        totalMemoryMB: this.toMB(totalMem),
        freeMemoryMB: this.toMB(freeMem),
        loadAvg: os.loadavg(),
        cpus: os.cpus().length,
        hostname: os.hostname(),
      },
      environment: process.env.NODE_ENV ?? 'development',
    };
  }

  private toMB(bytes: number): number {
    return Number((bytes / 1024 / 1024).toFixed(2));
  }

  private formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
  }
}
