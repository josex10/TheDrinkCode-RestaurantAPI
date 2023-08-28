import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from '../company/company.module';
import { RoleModule } from '../role/role.module';
import { RoleEntity } from '../role/entities';
import { CompanyEntity } from '../company/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, CompanyEntity]),
    CommonModule,
    CompanyModule,
    RoleModule,
    CompanyModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
