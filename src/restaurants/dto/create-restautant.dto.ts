import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from 'src/auth/schemas/user.shema';

export class createRestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string;
  @IsNotEmpty()
  @IsPhoneNumber('EE', { message: 'Please enter correct phone number' })
  readonly phone: number;
  @IsNotEmpty()
  @IsString()
  readonly address: string;
  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category' })
  readonly category: Category;
  readonly images: [];
  @IsEmpty({message: 'You cannot provide user ID.'})
  readonly user: User
}
