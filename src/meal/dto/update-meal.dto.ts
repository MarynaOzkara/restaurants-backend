import { User } from "src/auth/schemas/user.shema"
import { Category } from "../schemas/meal.schema"
import { IsEmpty, IsEnum, IsNumber, IsOptional, IsString } from "class-validator"



export class UpdateMealDto {
    @IsOptional()
    @IsString()
    readonly name: string

    @IsOptional()
    @IsString()
    readonly description: string

    @IsOptional()
    @IsNumber()
    readonly price: number

    @IsOptional()
    @IsEnum(Category, {message: 'Please enter correct category for meal.'})
    readonly category: Category

    @IsOptional()
    @IsString()
    readonly restaurant: string

    @IsEmpty({message: 'You cannot provide a User ID'})
    readonly user: User
}