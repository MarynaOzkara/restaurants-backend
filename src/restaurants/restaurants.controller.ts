import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { createRestaurantDto } from './dto/create-restautant.dto';
import { updateRestaurantDto } from './dto/update-restaurant.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.shema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
// import { ApiBody, ApiOperatquery?: unknownquery: unknownion, ApiResponse, ApiTags } from '@nestjs/swagger';

// @ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}
  @Get()
  // @ApiOperation({ summary: 'Get All Restaurans' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'All Restaurants',
  // })
 
  async getAllRestaurants(
    @Query()
    query: ExpressQuery,  
  ): Promise<Restaurant[]> {
    
    return this.restaurantsService.findAll(query);
  }
  @Post() 
  // @ApiOperation({ summary: 'Create Restaurant' })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       name: {
  //         type: 'string',
  //         description: 'Restaurant name',
  //         example: 'Restoran Armudu Haabersti',
  //       },
  //       description: {
  //         type: 'string',
  //         description: 'Description of restaurant',
  //         example:
  //           'A modern restaurant with a menu that will make your mouth water. Servicing delicious food since 2014. Enjoy our seasonal menu and experience the beauty of naturalness.',
  //       },
  //       email: {
  //         type: 'string',
  //         description: 'Restaurants email',
  //         example: 'haabersti@restoranarmudu.ee',
  //       },
  //       address: {
  //         type: 'string',
  //         description: 'Restaurants address',
  //         example: 'Meistri 22, 13517 Tallinn',
  //       },
  //       category: {
  //         type: 'string',
  //         description: 'Restaurants category',
  //         example: 'Fine dinning',
  //       },
  //       images: {
  //         type: 'array',
  //       },
  //     },
  //   },
  // })
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async createRestaurant(
    @Body()
    restaurant: createRestaurantDto,
    @CurrentUser() user: User
  ): Promise<Restaurant> {
    return this.restaurantsService.createNew(restaurant, user);
  }

  @Get(':id')
  async getRestaurant(
    @Param('id')
    id: string,
  ): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateRestaurant(
    @Param('id')
    id: string,
    @Body()
    restaurant: updateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    const res = await this.restaurantsService.findById(id);
    
    if(res.user.toString() !== user.id.toString()){

      throw new ForbiddenException('You can not update this restaurant')
    }
    return this.restaurantsService.updateById(id, restaurant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteRestaurant(
    @Param('id')
    id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const res = await this.restaurantsService.findById(id);
    if(res.user.toString() !== user.id.toString()){

      throw new ForbiddenException('You can not delete this restaurant')
    }
    const restaurant = this.restaurantsService.deleteById(id);
    
    if (restaurant) {
      return {
        deleted: true,
      };
    }
  }
  
  @Put('upload/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id')
    id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @CurrentUser() user: User,
  ) {
    const res = await this.restaurantsService.findById(id);
    if(res.user.toString() !== user.id.toString()){

      throw new ForbiddenException('You can not delete this restaurant')
    }
    const restaurant = await this.restaurantsService.uploadImages(id, files);
    return restaurant;
  }
}
