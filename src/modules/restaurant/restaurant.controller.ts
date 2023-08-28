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
import { RestaurantService } from './restaurant.service';
import { RestaurantDto } from './dtos';
import { HandlerResponseService } from 'src/common/helpers';

@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private handlerResponseService: HandlerResponseService,
  ) {}

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() restaurant: RestaurantDto) {
    const newRestaurant = await this.restaurantService.fnCreate(restaurant);
    return this.handlerResponseService.handleSuccess(
      newRestaurant,
      HttpStatus.CREATED,
      RestaurantService.name,
    );
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Body() restaurant: RestaurantDto, @Param('id') id: string) {
    const updatedRestaurant = await this.restaurantService.fnUpdate(
      restaurant,
      id,
    );
    return this.handlerResponseService.handleSuccess(
      updatedRestaurant,
      HttpStatus.OK,
      RestaurantService.name,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const deletedRestaurant = await this.restaurantService.fnDelete(id);
    return this.handlerResponseService.handleSuccess(
      deletedRestaurant,
      HttpStatus.OK,
      RestaurantService.name,
    );
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  async activate(@Param('id') id: string) {
    const activateRestaurant = await this.restaurantService.fnActivate(id);
    return this.handlerResponseService.handleSuccess(
      activateRestaurant,
      HttpStatus.OK,
      RestaurantService.name,
    );
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const groupOfRestaurants = await this.restaurantService.fnFindAll();
    return this.handlerResponseService.handleSuccess(
      groupOfRestaurants,
      HttpStatus.OK,
      RestaurantService.name,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOneById(@Param('id') id: string) {
    const restaurant = await this.restaurantService.fnFindOneById(id);
    return this.handlerResponseService.handleSuccess(
      restaurant,
      HttpStatus.OK,
      RestaurantService.name,
    );
  }
}
