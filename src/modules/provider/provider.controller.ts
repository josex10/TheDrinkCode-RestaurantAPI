import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { HandlerResponseService } from 'src/common/helpers';
import { ProviderDto } from './dto';

@Controller('provider')
export class ProviderController {
  constructor(
    private readonly providerService: ProviderService,
    private handlerResponseService: HandlerResponseService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() provider: ProviderDto) {
    const newProvider = await this.providerService.fnCreate(provider);
    return this.handlerResponseService.handleSuccess(
      newProvider,
      HttpStatus.CREATED,
      ProviderService.name,
      'messageSuccessCreateProvider',
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() provider: ProviderDto, @Param('id') id: string) {
    const updatedProvider = await this.providerService.fnUpdate(
      provider,
      Number(id),
    );
    return this.handlerResponseService.handleSuccess(
      updatedProvider,
      HttpStatus.OK,
      ProviderService.name,
    );
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    const activatedProvider = await this.providerService.fnActivate(Number(id));
    return this.handlerResponseService.handleSuccess(
      activatedProvider,
      HttpStatus.OK,
      ProviderService.name,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const deletedProvider = await this.providerService.fnDelete(Number(id));
    return this.handlerResponseService.handleSuccess(
      deletedProvider,
      HttpStatus.OK,
      ProviderService.name,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    const provider = await this.providerService.fnFindOneById(Number(id));
    return this.handlerResponseService.handleSuccess(
      provider,
      HttpStatus.OK,
      ProviderService.name,
    );
  }

  @Get('findAll/:id_company')
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('id_company') id_company: string) {
    const groupofProviders = await this.providerService.fnFindAll(
      Number(id_company),
    );
    return this.handlerResponseService.handleSuccess(
      groupofProviders,
      HttpStatus.OK,
      ProviderService.name,
    );
  }
}
