import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  IsObject,
} from 'class-validator';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends Document {
  @Prop()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @Prop({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ type: Object })
  @IsObject()
  @IsOptional()
  avatar: {
    key: string;
    value: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
