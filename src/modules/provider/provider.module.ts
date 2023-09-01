import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ProviderEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([ProviderEntity]), CommonModule],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [CommonModule],
})
export class ProviderModule {}
