import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

  @Get()
  getHeartBeat(): string {
    return JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() });
  }
}
