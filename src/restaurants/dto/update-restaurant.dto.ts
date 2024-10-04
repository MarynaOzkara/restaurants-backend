import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from 'src/auth/schemas/user.shema';


export class updateRestaurantDto {
  @IsOptional()
  @IsString()
  readonly name: string;
  @IsOptional()
  @IsString()
  readonly description: string;
  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string;
  @IsOptional()
  @IsPhoneNumber('EE', { message: 'Please enter correct phone number' })
  readonly phone: number;
  @IsOptional()
  @IsString()
  readonly address: string;
  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category' })
  readonly category: Category;
  readonly images: [];
  @IsEmpty({message: 'You cannot provide user ID.'})
  readonly user: User
}
