import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CompanyEntity } from './entities';
import { CompanyDto } from './dtos';

import { HandlerResponseService } from '../../common/helpers/handler-response.service';
import { ICompany } from './models';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyEntityRepository: Repository<CompanyEntity>,
    private handlerResponseService: HandlerResponseService,
  ) {}

  fnStagingCreation = async (company: CompanyDto) => {
    let tmpCompany = await this.fnFindOneByEmail(company.clm_email);
    if (tmpCompany) {
      throw new BadRequestException('Duplicate company email.');
    }

    tmpCompany = await this.fnFindOneByName(company.clm_company_name);
    if (tmpCompany) {
      throw new BadRequestException('Duplicate company name.');
    }

    return this.companyEntityRepository.create({
      ...company,
      clm_id: null,
      clm_is_active: true,
      clm_created_at: new Date(),
      clm_updated_at: new Date(),
    });
  };

  fnCreate = async (company: CompanyDto): Promise<CompanyEntity> => {
    const newCompany = await this.fnStagingCreation(company);
    try {
      return await this.companyEntityRepository.save(newCompany);
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnUpdate = async (
    company: CompanyDto,
    id: string,
  ): Promise<CompanyEntity> => {
    try {
      const getCompany = await this.fnFindOneById(id);
      if (!getCompany) {
        throw new NotFoundException('Company not found.');
      }

      let tmpCompany = await this.fnFindOneByEmail(company.clm_email);
      if (tmpCompany && tmpCompany.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate company email.');
      }

      tmpCompany = await this.fnFindOneByName(company.clm_company_name);
      if (tmpCompany && tmpCompany.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate company name.');
      }

      const updateCompany: ICompany = {
        ...company,
        clm_id: Number(id),
        clm_is_active: getCompany.clm_is_active,
        clm_created_at: getCompany.clm_created_at,
        clm_updated_at: new Date(),
      };

      return await this.companyEntityRepository.save(updateCompany);
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnDelete = async (id: string): Promise<CompanyEntity> => {
    try {
      const getCompany = await this.fnFindOneById(id);
      if (!getCompany) {
        throw new NotFoundException('Company not found.');
      }
      const deletedCompany: ICompany = {
        ...getCompany,
        clm_id: Number(id),
        clm_is_active: false,
      };
      return await this.companyEntityRepository.save(deletedCompany);
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnActivate = async (id: string): Promise<CompanyEntity> => {
    try {
      const getCompany = await this.fnFindOneById(id);
      if (!getCompany) {
        throw new NotFoundException('Company not found.');
      }
      const activatedCompany: ICompany = {
        ...getCompany,
        clm_id: Number(id),
        clm_is_active: true,
      };
      return await this.companyEntityRepository.save(activatedCompany);
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnFindAll = async (): Promise<CompanyEntity[]> => {
    try {
      return await this.companyEntityRepository.find();
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnFindOneById = async (id: string): Promise<CompanyEntity> => {
    try {
      const idParse = parseInt(id);

      if (isNaN(idParse)) {
        throw new BadRequestException('Invalid company Id.');
      }
      const company = await this.companyEntityRepository.findOne({
        where: {
          clm_id: idParse,
        },
      });
      return company;
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnFindOneByName = async (name: string): Promise<CompanyEntity> => {
    try {
      const company = await this.companyEntityRepository.findOne({
        where: {
          clm_company_name: name,
        },
      });

      return company;
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };

  fnFindOneByEmail = async (email: string): Promise<CompanyEntity> => {
    try {
      const company = await this.companyEntityRepository.findOne({
        where: {
          clm_email: email,
        },
      });

      return company;
    } catch (error) {
      this.handlerResponseService.handleError(error, CompanyService.name);
    }
  };
}
