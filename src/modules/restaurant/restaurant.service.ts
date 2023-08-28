import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './entities';
import { Repository } from 'typeorm';
import { HandlerResponseService } from 'src/common/helpers';
import { RestaurantDto } from './dtos';
import { IRestaurant } from './models';
import { CompanyService } from '../company/company.service';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private restaurantEntityRepository: Repository<RestaurantEntity>,
    private handlerResponseService: HandlerResponseService,
    private companyService: CompanyService,
  ) {}

  fnStagingRegister = async (restaurant: RestaurantDto) => {
    const tmpRestaurant = await this.fnFindOneByName(restaurant.clm_name);
    if (tmpRestaurant) {
      throw new BadRequestException('Duplicate restaurant name.');
    }

    return this.restaurantEntityRepository.create({
      ...restaurant,
      clm_id: null,
      clm_is_active: true,
      clm_created_at: new Date(),
      clm_updated_at: new Date(),
    });
  };

  fnStagingCreation = async (restaurant: RestaurantDto) => {
    const tmpCompany = await this.companyService.fnFindOneById(
      String(restaurant.clm_id_company),
    );
    if (!tmpCompany || !tmpCompany.clm_is_active) {
      throw new NotFoundException('Company Not found or is disabled.');
    }
    const tmpRestaurant = await this.fnFindOneByName(restaurant.clm_name);
    if (tmpRestaurant) {
      throw new BadRequestException('Duplicate restaurant name.');
    }

    return this.restaurantEntityRepository.create({
      ...restaurant,
      clm_id: null,
      clm_is_active: true,
      clm_created_at: new Date(),
      clm_updated_at: new Date(),
    });
  };

  fnCreate = async (restaurant: RestaurantDto): Promise<RestaurantEntity> => {
    const newRestaurant = await this.fnStagingCreation(restaurant);
    try {
      return await this.restaurantEntityRepository.save(newRestaurant);
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnUpdate = async (
    restaurant: RestaurantDto,
    id: string,
  ): Promise<RestaurantEntity> => {
    try {
      const getRestaurant = await this.fnFindOneById(id);
      if (!getRestaurant) {
        throw new NotFoundException('Restaurant not found.');
      }

      const tmpRestaurant = await this.fnFindOneByName(restaurant.clm_name);
      if (tmpRestaurant && tmpRestaurant.clm_id != Number(id)) {
        throw new BadRequestException('Duplicate Restaurant name.');
      }

      const updateRestaurant: IRestaurant = {
        ...restaurant,
        clm_id_company: getRestaurant.clm_id_company,
        clm_id: Number(id),
        clm_is_active: getRestaurant.clm_is_active,
        clm_created_at: getRestaurant.clm_created_at,
        clm_updated_at: new Date(),
      };

      return await this.restaurantEntityRepository.save(updateRestaurant);
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnDelete = async (id: string): Promise<RestaurantEntity> => {
    try {
      const getRestaurant = await this.fnFindOneById(id);
      if (!getRestaurant) {
        throw new NotFoundException('Restaurant not found.');
      }
      const deletedRestaurant: IRestaurant = {
        ...getRestaurant,
        clm_id: Number(id),
        clm_is_active: false,
      };
      return await this.restaurantEntityRepository.save(deletedRestaurant);
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnActivate = async (id: string): Promise<RestaurantEntity> => {
    try {
      const getRestaurant = await this.fnFindOneById(id);
      if (!getRestaurant) {
        throw new NotFoundException('Restaurant not found.');
      }
      const activatedRestaurant: IRestaurant = {
        ...getRestaurant,
        clm_id: Number(id),
        clm_is_active: true,
      };
      return await this.restaurantEntityRepository.save(activatedRestaurant);
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnFindOneById = async (id: string): Promise<RestaurantEntity> => {
    try {
      const idParse = parseInt(id);

      if (isNaN(idParse)) {
        throw new BadRequestException('Invalid Restaurant Id.');
      }

      const restaurant = await this.restaurantEntityRepository.findOne({
        where: {
          clm_id: idParse,
        },
      });

      return restaurant;
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnFindAll = async (): Promise<RestaurantEntity[]> => {
    try {
      return await this.restaurantEntityRepository.find();
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnFindRestaurantForAuthResponse = async (
    user_id: number,
  ): Promise<RestaurantEntity[]> => {
    try {
      return await this.restaurantEntityRepository.find({
        relations: {
          company: true,
        },
        where: {
          users: {
            clm_id: user_id,
          },
        },
      });
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };

  fnFindOneByName = async (name: string): Promise<RestaurantEntity> => {
    try {
      const restaurant = await this.restaurantEntityRepository.findOne({
        where: {
          clm_name: name,
        },
      });

      return restaurant;
    } catch (error) {
      this.handlerResponseService.handleError(error, RestaurantService.name);
    }
  };
}
