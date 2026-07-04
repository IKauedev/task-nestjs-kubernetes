import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World!',
      app: process.env.APP ?? 'unknown',
      timestamp: new Date().toISOString(),
    };
  }

  getInfo() {
    return {
      app: process.env.APP ?? 'unknown',
      nodeEnv: process.env.NODE_ENV ?? 'development',
      apiKeyConfigured: !!process.env.API_KEY,
      version: process.env.npm_package_version ?? '0.0.1',
      pid: process.pid,
      platform: process.platform,
    };
  }
}
