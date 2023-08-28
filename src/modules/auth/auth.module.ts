import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { CommonModule } from 'src/common/common.module';
import { CompanyModule } from '../company/company.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { RoleModule } from '../role/role.module';
import { TokenService } from './token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/config';

@Module({
  imports: [
    UserModule,
    CommonModule,
    CompanyModule,
    RestaurantModule,
    RoleModule,
    JwtModule.registerAsync({
      useClass: JwtConfig,
    }),
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
