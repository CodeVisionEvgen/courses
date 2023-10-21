import { HydratedDocument } from 'mongoose';
import { SchemaFactory, Prop, Schema } from '@nestjs/mongoose';

export type UserModelDocument = HydratedDocument<UserModel>;

@Schema()
export class UserModel {
  @Prop({
    unique: true,
  })
  email: string;

  @Prop()
  passwordHash: string;
}

export const UserModelSchema = SchemaFactory.createForClass(UserModel);
