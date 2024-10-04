import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.shema";


export enum Category{
    SOURS = 'Soups',
    SALADS = 'Salads',
    SANDWICHES = 'Sandwiches',
    PASTA = 'Pasta'
}

@Schema({
    timestamps: true
})
export class Meal{
    @Prop()
    name: string

    @Prop()
    description: string

    @Prop()
    price: number

    @Prop()
    category: Category

    @Prop({type: mongoose.Schema.ObjectId, ref: 'Restaurant'})
    restaurant: string

    @Prop({type: mongoose.Schema.ObjectId, ref: 'User'})
    user: User
}

export const MealSchema = SchemaFactory.createForClass(Meal)