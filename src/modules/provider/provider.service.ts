import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProviderEntity } from './entities';
import { HandlerResponseService } from 'src/common/helpers';
import { Repository } from 'typeorm';
import { ProviderDto } from './dto';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(ProviderEntity)
    private providerEntityRepository: Repository<ProviderEntity>,
    private handlerResponseService: HandlerResponseService,
  ) {}

  fnCreate = async (provider: ProviderDto): Promise<ProviderEntity> => {
    const { clm_name, clm_id_company } = provider;
    const tmpProvider = await this.fnFindOneByName(clm_name, clm_id_company);
    if (tmpProvider) {
      this.handlerResponseService.handleError(
        { message: 'Duplicate Provider name', status: 400 },
        ProviderService.name,
        'messageErrorDuplicateNameProvider',
      );
    }
    const newProvider = this.providerEntityRepository.create({
      ...provider,
      clm_is_active: true,
      clm_created_at: new Date(),
      clm_updated_at: new Date(),
    });
    return await this.providerEntityRepository.save(newProvider);
  };

  fnUpdate = async (
    provider: ProviderDto,
    id: number,
  ): Promise<ProviderEntity> => {
    try {
      const { clm_name, clm_id_company } = provider;
      let tmpProvider = await this.fnFindOneById(id);
      if (!tmpProvider) {
        throw new NotFoundException('Provider not found.');
      }

      tmpProvider = await this.fnFindOneByName(clm_name, clm_id_company);
      if (tmpProvider && tmpProvider.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate Provider name.');
      }

      const updatedProvider = this.providerEntityRepository.create({
        ...tmpProvider,
        ...provider,
        clm_updated_at: new Date(),
      });

      return await this.providerEntityRepository.save(updatedProvider);
    } catch (error) {
      this.handlerResponseService.handleError(error, ProviderService.name);
    }
  };

  fnDelete = async (id: number): Promise<ProviderEntity> => {
    try {
      const getProvider = await this.fnFindOneById(id);
      if (!getProvider) {
        throw new NotFoundException('Provider not found.');
      }

      const deletedRole = this.providerEntityRepository.create({
        ...getProvider,
        clm_is_active: false,
        clm_updated_at: new Date(),
      });

      return await this.providerEntityRepository.save(deletedRole);
    } catch (error) {
      this.handlerResponseService.handleError(error, ProviderService.name);
    }
  };

  fnActivate = async (id: number): Promise<ProviderEntity> => {
    try {
      const getProvider = await this.fnFindOneById(id);
      if (!getProvider) {
        throw new NotFoundException('Provider not found.');
      }

      const activatedRole = this.providerEntityRepository.create({
        ...getProvider,
        clm_is_active: true,
        clm_updated_at: new Date(),
      });

      return await this.providerEntityRepository.save(activatedRole);
    } catch (error) {
      this.handlerResponseService.handleError(error, ProviderService.name);
    }
  };

  fnFindAll = async (companyId: number): Promise<ProviderEntity[]> => {
    try {
      return await this.providerEntityRepository.find({
        where: {
          clm_id_company: companyId,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, ProviderService.name);
    }
  };

  fnFindOneById = async (id: number): Promise<ProviderEntity> => {
    try {
      return await this.providerEntityRepository.findOne({
        where: {
          clm_id: id,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, ProviderService.name);
    }
  };

  fnFindOneByName = async (
    name: string,
    companyId: number,
  ): Promise<ProviderEntity> => {
    try {
      return await this.providerEntityRepository.findOne({
        where: {
          clm_name: name,
          clm_id_company: companyId,
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, ProviderService.name);
    }
  };
}
