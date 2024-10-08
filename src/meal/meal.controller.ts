import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.shema';
import { AuthGuard } from '@nestjs/passport';
import { Meal } from './schemas/meal.schema';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';

@Controller('meals')
export class MealController {
    constructor(private mealService: MealService){}

    @Get()
    async  getAllMeals(
    @Query() 
    query: ExpressQuery
    ): Promise<Meal[]>{
        return this.mealService.findAll(query)
    }

    @Get('restaurant/:id')
  async getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]>{
    return this.mealService.findByRestaurant(id)
  }
    @Get(':id')
    async getMeal(@Param('id') id: string): Promise<Meal>{
        return this.mealService.findById(id)
    }

    @Post()
    @UseGuards(AuthGuard())
  async  createMeal(
        @Body() createMealDto: CreateMealDto,
        @CurrentUser() user: User,
    ): Promise<Meal>{
        return this.mealService.create(createMealDto, user)
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateMeal(
        @Body() updateMealDto: UpdateMealDto,
        @Param('id') id: string,
        @CurrentUser() user: User,
    ): Promise<Meal>{
        const meal = await this.mealService.findById(id)
        if(meal.user.toString() !== user.id) {
            throw new ForbiddenException('You can not update this meal.')
        }
        return this.mealService.updateById(id, updateMealDto)
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteMeal(
        @Param('id') id: string,
        @CurrentUser() user: User,
    ): Promise<{deleted: boolean}>{
        const meal = await this.mealService.findById(id)
        if(meal.user.toString() !== user.id){
            throw new ForbiddenException('You can not delete this meal')
        }
        return this.mealService.deleteById(id)
    }
}
