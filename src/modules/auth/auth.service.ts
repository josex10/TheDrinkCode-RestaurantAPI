import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import * as bcryptjs from 'bcryptjs';
import { DataSource } from 'typeorm';

import { UserService } from '../user/user.service';
import { HandlerResponseService } from '../../common/helpers/handler-response.service';
import { CompanyService } from '../company/company.service';
import { RoleService } from '../role/role.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { TokenService } from './token/token.service';

import { AuthHelper } from './helpers';

import { RegisterDto, LoginDto } from './dtos';
import { CompanyEntity } from '../company/entities';
import { RoleEntity } from '../role/entities';
import { UserEntity } from '../user/entities';
import { IAuthResponse } from './models';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private restaurantService: RestaurantService,
    private roleService: RoleService,
    private handlerResponseService: HandlerResponseService,
    private dataSource: DataSource,
    private tokenService: TokenService,
  ) {}

  fnLogin = async ({ username, password }: LoginDto) => {
    try {
      const getUser = await this.userService.fnFindOneByUsername(username);
      if (!getUser) {
        throw new UnauthorizedException('Invalid username');
      }

      const isPasswordValid = await bcryptjs.compare(
        password,
        getUser.clm_password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      return await this.fnAuthReturnData(getUser);
    } catch (error) {
      this.handlerResponseService.handleError(error, AuthService.name);
    }
  };

  fnRegister = async (register: RegisterDto) => {
    const role = await this.fnRegisterProcessCheckRole();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tmpCompany = await this.fnRegisterProcessCheckCompany(register);
      const newCompany = await queryRunner.manager.save(tmpCompany);

      const tmpUser = await this.fnRegisterProcessCheckUser(
        register,
        newCompany,
        role,
        0,
      );
      const newUser = await queryRunner.manager.save(tmpUser);

      const tmpRestaurant = await this.fnRegisterProcessCheckRestaurant(
        register,
        newCompany.clm_id,
        newUser,
      );
      const newRestaurant = await queryRunner.manager.save(tmpRestaurant);

      const tempUpdateUser =
        await this.userService.fnStagingRegisterUpdateFavoriteRestaurant({
          ...newUser,
          clm_favolite_restaurant: newRestaurant.clm_id,
        });
      const updatedUser = await queryRunner.manager.save(tempUpdateUser);

      await queryRunner.commitTransaction();

      return {
        username: updatedUser.clm_username,
        company: newCompany,
        restaurant: newRestaurant,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handlerResponseService.handleError(error, AuthService.name);
    } finally {
      await queryRunner.release();
    }
  };

  fnRefresh = async (userId: number) => {
    const user = await this.userService.fnFindOneById(String(userId));
    return await this.fnAuthReturnData(user);
  };

  private fnAuthReturnData = async (
    user: UserEntity,
  ): Promise<IAuthResponse> => {
    const groupOfRestaurants =
      await this.restaurantService.fnFindRestaurantForAuthResponse(user.clm_id);

    if (!groupOfRestaurants || groupOfRestaurants.length === 0) {
      throw new NotFoundException('Not restaurants found for the user');
    }

    let company_name = '';

    const restaurants = groupOfRestaurants.map((rest) => {
      company_name = rest.company.clm_company_name;
      return {
        restaurant_id: rest.clm_id,
        restaurant_name: rest.clm_name,
      };
    });

    const role = await this.roleService.fnFindOneById(String(user.clm_id_role));

    const token = await this.tokenService.signAccessToken(user);

    return {
      auth: {
        user_id: user.clm_id,
        user_name: user.clm_name,
        selected_restaurant: user.clm_favolite_restaurant,
        company_id: user.clm_id_company,
        company_name,
        restaurants,
        role_id: role.clm_id,
        role_name: role.clm_name,
        role_key: role.clm_key,
      },
      token,
    };
  };

  private fnRegisterProcessCheckCompany = async (register: RegisterDto) => {
    const { clm_company_name, clm_country, clm_phone, clm_email, clm_address } =
      register;
    const tmpCompany = await this.companyService.fnStagingCreation({
      clm_company_name,
      clm_country,
      clm_phone,
      clm_email,
      clm_address,
    });

    return tmpCompany;
  };

  private fnRegisterProcessCheckRestaurant = async (
    register: RegisterDto,
    companyId: number,
    user: UserEntity,
  ) => {
    const { clm_restaurant_name, clm_phone, clm_email, clm_address } = register;
    const restaurant = await this.restaurantService.fnStagingRegister({
      clm_id_company: companyId,
      clm_name: clm_restaurant_name,
      clm_phone,
      clm_email,
      clm_address,
    });

    restaurant.users = [user];
    return restaurant;
  };

  private fnRegisterProcessCheckUser = async (
    register: RegisterDto,
    company: CompanyEntity,
    role: RoleEntity,
    restaurant_id: number,
  ) => {
    const { clm_user_name, clm_password, clm_email } = register;
    const user = await this.userService.fnStagingRegister({
      clm_id_company: company.clm_id,
      clm_id_role: role.clm_id,
      clm_favolite_restaurant: restaurant_id,
      clm_name: clm_user_name,
      clm_username: AuthHelper.generateUsername(clm_user_name, company.clm_id),
      clm_email,
      clm_password,
    });

    return user;
  };

  private fnRegisterProcessCheckRole = async () => {
    const highestRoleHierarchy = 1;
    const role = await this.roleService.fnFindOneByHierarchy(
      highestRoleHierarchy,
    );
    if (!role) {
      this.handlerResponseService.handleError(
        { message: 'High Hierarchy not found', status: 404 },
        AuthService.name,
      );
    }

    return role;
  };
}
