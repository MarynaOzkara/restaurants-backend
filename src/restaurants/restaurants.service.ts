import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import APIFeatures from '../utils/apiFeatures.utils';
import { User } from '../auth/schemas/user.shema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async findAll(query: Query): Promise<Restaurant[]> {
    const page = Number(query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const restautants = await this.restaurantModel
      .find(keyword)
      .limit(limit)
      .skip(skip);
    return restautants;
  }
  async createNew(restaurant: Restaurant, user: User): Promise<Restaurant> {
    const location = await APIFeatures.getRestaurantLocation(
      restaurant.address,
    );
    const data = Object.assign(restaurant, {user: user.id, location });
    const res = await this.restaurantModel.create(data);
    return res;
  }
  async findById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct ID');
    }
    const res = await this.restaurantModel.findById(id);
    if (!res) {
      throw new NotFoundException('Restaurant not found.');
    }
    return res;
  }
  async updateById(id: string, restaurant: Restaurant): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct ID');
    }
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant,  {
      new: true,
      runValidators: true,
    });
  }
  async deleteById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Please enter correct ID');
    }
    return await this.restaurantModel.findByIdAndDelete(id);
  }
  async uploadImages(id, files) {
    const images = await APIFeatures.upload(files);
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images: images,
      },
      { new: true, runValidators: true },
    );
    return restaurant;
  }
}
