import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schemas/meal.schema';
import mongoose from 'mongoose';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { User } from 'src/auth/schemas/user.shema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Meal.name)
        private mealModel: mongoose.Model<Meal>,
        @InjectModel(Restaurant.name)
        private restaurantModel: mongoose.Model<Restaurant>
    ){}
    async findAll(query: Query): Promise<Meal[]>{
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

        const meals = await this.mealModel
        .find(keyword)
        .limit(limit)
        .skip(skip)
        return meals
    }
    
    async findByRestaurant(id: string): Promise<Meal[]>{
        const meals = await this.mealModel.find({restaurant: id})
        return meals
    }
    async findById(id: string): Promise<Meal>{
        const isValidId = mongoose.isValidObjectId(id)
        if(!isValidId){
            throw new BadRequestException('Wrong ID pattern')
        }
        const meal = await this.mealModel.findById(id)
        if(!meal){
            throw new NotFoundException('Meal not found')
        }
        return meal
    }

    async create(meal: Meal, user: User): Promise<Meal>{
        const data = Object.assign(meal, {user: user.id})

        // saving meal in the restaurant menu
        const restaurant = await this.restaurantModel.findById(meal.restaurant)

        if(!restaurant){
            throw new NotFoundException('Restaurant not found with this ID.')
        }
        
        if(restaurant.user.toString() !== user.id){
           
            throw new ForbiddenException('You can not to add meal to this restaurant')
        }
        const mealCreated = await this.mealModel.create(data)
        restaurant.menu.push(mealCreated.id)
        await restaurant.save()

        return mealCreated
    }

    async updateById(id: string, meal: Meal): Promise<Meal>{
return await this.mealModel.findByIdAndUpdate(id, meal, {
    new: true,
    runValidators: true
})
    }

    async deleteById(id: string): Promise<{deleted: boolean}>{
       const res = await this.mealModel.findByIdAndDelete(id)
       if(!res){
        return {deleted: false}}
        return {deleted: true}
       
    }
}
