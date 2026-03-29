import { Controller, Get } from '@nestjs/common';

/**
 * AppController
 * This controller serves as a simple health check endpoint for the application.
 */
@Controller()
export class AppController {

  /**
   * Returns a simple JSON object indicating the application's health status.
   * @returns {string} A JSON string containing the status and timestamp.
   */
  @Get()
  getHeartBeat(): string {
    return JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() });
  }
}
