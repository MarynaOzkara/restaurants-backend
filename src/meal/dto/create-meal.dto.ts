import { User } from "src/auth/schemas/user.shema"
import { Category } from "../schemas/meal.schema"
import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"



export class CreateMealDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    readonly description: string

    @IsNotEmpty()
    @IsNumber()
    readonly price: number

    @IsNotEmpty()
    @IsEnum(Category, {message: 'Please enter correct category for meal.'})
    readonly category: Category

    @IsNotEmpty()
    @IsString()
    readonly restaurant: string

    @IsEmpty({message: 'You cannot provide a User ID'})
    readonly user: User
}