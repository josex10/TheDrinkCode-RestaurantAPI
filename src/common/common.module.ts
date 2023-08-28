import { Module } from '@nestjs/common';
import { HandlerResponseService } from './helpers/handler-response.service';

@Module({
  providers: [HandlerResponseService],
  exports: [HandlerResponseService],
})
export class CommonModule {}
