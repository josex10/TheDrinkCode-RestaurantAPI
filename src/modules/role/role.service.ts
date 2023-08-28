import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleEntity } from './entities';
import { Repository } from 'typeorm';
import { HandlerResponseService } from 'src/common/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleDto } from './dtos';
import { RoleHelper } from './helpers/helper';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private RoleEntityRepository: Repository<RoleEntity>,
    private handlerResponseService: HandlerResponseService,
  ) {}

  fnCreate = async (role: RoleDto): Promise<RoleEntity> => {
    try {
      let tmpRole = await this.fnFindOneByKey(role.clm_key);
      if (tmpRole) {
        throw new BadRequestException('Duplicate Role key.');
      }

      tmpRole = await this.fnFindOneByName(role.clm_name);
      if (tmpRole) {
        throw new BadRequestException('Duplicate Role name.');
      }

      tmpRole = await this.fnFindOneByHierarchy(role.clm_hierarchy);
      if (tmpRole) {
        throw new BadRequestException('Duplicate Hierarchy.');
      }

      const newRole = this.RoleEntityRepository.create({
        ...role,
        clm_key: RoleHelper.transformRoleKey(role.clm_key),
        clm_is_active: true,
        clm_created_at: new Date(),
        clm_updated_at: new Date(),
      });
      return await this.RoleEntityRepository.save(newRole);
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnUpdate = async (role: RoleDto, id: string): Promise<RoleEntity> => {
    try {
      let tmpRole = await this.fnFindOneById(id);
      if (!tmpRole) {
        throw new NotFoundException('Role not found.');
      }

      tmpRole = await this.fnFindOneByKey(role.clm_key);
      if (tmpRole && tmpRole.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate Role key.');
      }

      tmpRole = await this.fnFindOneByName(role.clm_name);
      if (tmpRole && tmpRole.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate Role name.');
      }

      tmpRole = await this.fnFindOneByHierarchy(role.clm_hierarchy);
      if (tmpRole && tmpRole.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate Hierarchy.');
      }

      const updatedRole = this.RoleEntityRepository.create({
        ...tmpRole,
        ...role,
        clm_key: RoleHelper.transformRoleKey(role.clm_key),
        clm_updated_at: new Date(),
      });

      return await this.RoleEntityRepository.save(updatedRole);
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnDelete = async (id: string): Promise<RoleEntity> => {
    try {
      const getRole = await this.fnFindOneById(id);
      if (!getRole) {
        throw new NotFoundException('Role not found.');
      }

      const deletedRole = this.RoleEntityRepository.create({
        ...getRole,
        clm_is_active: false,
        clm_updated_at: new Date(),
      });

      return await this.RoleEntityRepository.save(deletedRole);
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnActivate = async (id: string): Promise<RoleEntity> => {
    try {
      const getRole = await this.fnFindOneById(id);
      if (!getRole) {
        throw new NotFoundException('Role not found.');
      }

      const activatedRole = this.RoleEntityRepository.create({
        ...getRole,
        clm_is_active: true,
        clm_updated_at: new Date(),
      });

      return await this.RoleEntityRepository.save(activatedRole);
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnFindAll = async (): Promise<RoleEntity[]> => {
    try {
      return await this.RoleEntityRepository.find();
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnFindOneById = async (id: string): Promise<RoleEntity> => {
    try {
      const idParse = parseInt(id);

      if (isNaN(idParse)) {
        throw new BadRequestException('Invalid Role Id.');
      }

      return await this.RoleEntityRepository.findOne({
        where: {
          clm_id: idParse,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnFindOneByName = async (name: string): Promise<RoleEntity> => {
    try {
      return await this.RoleEntityRepository.findOne({
        where: {
          clm_name: name,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnFindOneByKey = async (key: string): Promise<RoleEntity> => {
    try {
      return await this.RoleEntityRepository.findOne({
        where: {
          clm_key: key,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };

  fnFindOneByHierarchy = async (hierarchy: number): Promise<RoleEntity> => {
    try {
      if (hierarchy <= 0) {
        throw new BadRequestException('Invalid Hierarchy.');
      }
      return await this.RoleEntityRepository.findOne({
        where: {
          clm_hierarchy: hierarchy,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, RoleService.name);
    }
  };
}
