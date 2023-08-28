import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { HandlerResponseService } from 'src/common/helpers';
import { UserDto } from './dtos';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private handlerResponseService: HandlerResponseService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: UserDto) {
    const newUser = await this.userService.fnCreate(user);
    return this.handlerResponseService.handleSuccess(
      newUser,
      HttpStatus.CREATED,
      UserService.name,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() user: UserDto, @Param('id') id: string) {
    const updatedUser = await this.userService.fnUpdate(user, id);
    return this.handlerResponseService.handleSuccess(
      updatedUser,
      HttpStatus.OK,
      UserService.name,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const deletedUser = await this.userService.fnDelete(id);
    return this.handlerResponseService.handleSuccess(
      deletedUser,
      HttpStatus.OK,
      UserService.name,
    );
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    const activatedUser = await this.userService.fnActivate(id);
    return this.handlerResponseService.handleSuccess(
      activatedUser,
      HttpStatus.OK,
      UserService.name,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    const user = await this.userService.fnFindOneById(id);
    return this.handlerResponseService.handleSuccess(
      user,
      HttpStatus.OK,
      UserService.name,
    );
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const groupOfUsers = await this.userService.fnFindAll();
    return this.handlerResponseService.handleSuccess(
      groupOfUsers,
      HttpStatus.OK,
      UserService.name,
    );
  }
}
