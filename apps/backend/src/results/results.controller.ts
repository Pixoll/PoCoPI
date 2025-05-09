// apps/backend/src/raven-results/raven-results.controller.ts
import { Controller, Post, Body, Logger } from '@nestjs/common';
import { TestResults as RavenFrontendTestResults } from ''; 
@Controller('raven-results')
export class RavenResultsController {
  private readonly logger = new Logger(RavenResultsController.name);

  @Post()
  async receiveResults(@Body() testResults: RavenFrontendTestResults) {
    this.logger.debug('Resultados recibidos:', testResults);

    return { message: 'Resultados recibidos y procesados correctamente.', data: testResults };
  }
}