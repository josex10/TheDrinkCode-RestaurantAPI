import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HandlerResponseService } from 'src/common/helpers';
import { UserDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { RoleService } from '../role/role.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    private handlerResponseService: HandlerResponseService,
    private companyService: CompanyService,
    private roleSevice: RoleService,
  ) {}

  fnStagingRegister = async (user: UserDto) => {
    try {
      const tmpUser = await this.fnFindOneByUsername(user.clm_username);
      if (tmpUser) {
        throw new BadRequestException('Duplicate username.');
      }

      const hashedPassword = await bcryptjs.hash(user.clm_password, 10);

      return this.userEntityRepository.create({
        ...user,
        clm_password: hashedPassword,
        clm_id: null,
        clm_is_active: true,
        clm_created_at: new Date(),
        clm_updated_at: new Date(),
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnStagingRegisterUpdateFavoriteRestaurant = async (user: UserDto) => {
    try {
      return this.userEntityRepository.create({
        ...user,
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnStagingCreation = async (user: UserDto) => {
    const tmpCompany = await this.companyService.fnFindOneById(
      String(user.clm_id_company),
    );
    const tmpRole = await this.roleSevice.fnFindOneById(
      String(user.clm_id_role),
    );

    try {
      if (!tmpCompany || !tmpCompany.clm_is_active) {
        throw new BadRequestException('Company not found or is inactive.');
      }

      if (!tmpRole || !tmpRole.clm_is_active) {
        throw new BadRequestException('Role not found or is inactive.');
      }

      const tmpUser = await this.fnFindOneByUsername(user.clm_username);
      if (tmpUser) {
        throw new BadRequestException('Duplicate username.');
      }

      const hashedPassword = await bcryptjs.hash(user.clm_password, 10);

      return this.userEntityRepository.create({
        ...user,
        clm_password: hashedPassword,
        clm_id: null,
        clm_is_active: true,
        clm_created_at: new Date(),
        clm_updated_at: new Date(),
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnCreate = async (user: UserDto): Promise<UserEntity> => {
    const newUser = await this.fnStagingCreation(user);
    try {
      return await this.userEntityRepository.save(newUser);
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnUpdate = async (user: UserDto, id: string): Promise<UserEntity> => {
    try {
      const getUser = await this.fnFindOneById(id);
      if (!getUser) {
        throw new NotFoundException('User not found.');
      }

      const tmpUser = await this.fnFindOneByUsername(user.clm_username);
      if (tmpUser && tmpUser.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate username.');
      }

      const updatedUser = this.userEntityRepository.create({
        ...getUser,
        clm_name: user.clm_name,
        clm_username: user.clm_username,
        clm_email: user.clm_email,
        clm_updated_at: new Date(),
      });

      return await this.userEntityRepository.save(updatedUser);
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnDelete = async (id: string): Promise<UserEntity> => {
    try {
      const getUser = await this.fnFindOneById(id);
      if (!getUser) {
        throw new NotFoundException('User not found.');
      }

      const deletedUser = this.userEntityRepository.create({
        ...getUser,
        clm_is_active: true,
        clm_updated_at: new Date(),
      });

      return await this.userEntityRepository.save(deletedUser);
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnActivate = async (id: string): Promise<UserEntity> => {
    try {
      const getUser = await this.fnFindOneById(id);
      if (!getUser) {
        throw new NotFoundException('User not found.');
      }
      const activatedUser = this.userEntityRepository.create({
        ...getUser,
        clm_is_active: true,
        clm_updated_at: new Date(),
      });
      return await this.userEntityRepository.save(activatedUser);
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnFindAll = async (): Promise<UserEntity[]> => {
    try {
      return await this.userEntityRepository.find();
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnFindOneById = async (id: string): Promise<UserEntity> => {
    try {
      const idParse = parseInt(id);

      if (isNaN(idParse)) {
        throw new BadRequestException('Invalid User Id.');
      }

      return await this.userEntityRepository.findOne({
        where: {
          clm_id: idParse,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };

  fnFindOneByUsername = async (username: string): Promise<UserEntity> => {
    try {
      return await this.userEntityRepository.findOne({
        where: {
          clm_username: username,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, UserService.name);
    }
  };
}
