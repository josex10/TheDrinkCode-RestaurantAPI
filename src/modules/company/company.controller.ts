import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyDto } from './dtos';
import { HandlerResponseService } from '../../common/helpers/handler-response.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private handlerResponseService: HandlerResponseService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() company: CompanyDto) {
    const newCompany = await this.companyService.fnCreate(company);
    return this.handlerResponseService.handleSuccess(
      newCompany,
      HttpStatus.CREATED,
      CompanyService.name,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() company: CompanyDto, @Param('id') id: string) {
    const updatedCompany = await this.companyService.fnUpdate(company, id);
    return this.handlerResponseService.handleSuccess(
      updatedCompany,
      HttpStatus.OK,
      CompanyService.name,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const deletedCompany = await this.companyService.fnDelete(id);
    return this.handlerResponseService.handleSuccess(
      deletedCompany,
      HttpStatus.OK,
      CompanyService.name,
    );
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    const activatedCompany = await this.companyService.fnActivate(id);
    return this.handlerResponseService.handleSuccess(
      activatedCompany,
      HttpStatus.OK,
      CompanyService.name,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    const company = await this.companyService.fnFindOneById(id);
    return this.handlerResponseService.handleSuccess(
      company,
      HttpStatus.OK,
      CompanyService.name,
    );
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const groupOfCompanies = await this.companyService.fnFindAll();
    return this.handlerResponseService.handleSuccess(
      groupOfCompanies,
      HttpStatus.OK,
      CompanyService.name,
    );
  }
}
