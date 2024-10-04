import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.shema';
import { Meal } from 'src/meal/schemas/meal.schema';

@Schema()
export class Location {
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Prop({ index: '2dsphere' })
  coordinates: number[];

  formattedAddress: string;
  city: string;
  streetName: string;
  streetNumber: string;
  country: string;
}

export enum Category {
  FAST_FOOD = 'Fast food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine dinning',
}
@Schema({
  timestamps: true
})
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  email: string;

  @Prop()
  phone: number;

  @Prop()
  address: string;

  @Prop()
  category: Category;

  @Prop()
  images: object[];

  @Prop({type: Object, ref: 'Location'})
  location?: Location

  @Prop([{type: mongoose.Schema.ObjectId, ref: 'Meal'}])
  menu?: Meal[]

  @Prop({type: mongoose.Schema.ObjectId, ref: 'User'})
  user: User
}
export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
