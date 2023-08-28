import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { HandlerResponseService } from 'src/common/helpers';
import { RoleDto } from './dtos';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private handlerResponseService: HandlerResponseService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() role: RoleDto) {
    const newrole = await this.roleService.fnCreate(role);
    return this.handlerResponseService.handleSuccess(
      newrole,
      HttpStatus.CREATED,
      RoleService.name,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() role: RoleDto, @Param('id') id: string) {
    const updatedrole = await this.roleService.fnUpdate(role, id);
    return this.handlerResponseService.handleSuccess(
      updatedrole,
      HttpStatus.OK,
      RoleService.name,
    );
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    const activatedRole = await this.roleService.fnActivate(id);
    return this.handlerResponseService.handleSuccess(
      activatedRole,
      HttpStatus.OK,
      RoleService.name,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const deletedrole = await this.roleService.fnDelete(id);
    return this.handlerResponseService.handleSuccess(
      deletedrole,
      HttpStatus.OK,
      RoleService.name,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    const role = await this.roleService.fnFindOneById(id);
    return this.handlerResponseService.handleSuccess(
      role,
      HttpStatus.OK,
      RoleService.name,
    );
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const groupofRoles = await this.roleService.fnFindAll();
    return this.handlerResponseService.handleSuccess(
      groupofRoles,
      HttpStatus.OK,
      RoleService.name,
    );
  }
}
