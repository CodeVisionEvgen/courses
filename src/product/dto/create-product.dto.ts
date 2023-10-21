import { Type } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

class ProductCharacteristicDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class createProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  oldPrice?: number;

  @IsNumber()
  credit: number;

  @IsNumber()
  @IsOptional()
  calculateRating?: number;

  @IsString()
  description: string;

  @IsString()
  advantages: string;

  @IsString()
  disAdvantages: string;

  @IsArray()
  @IsString({
    each: true,
  })
  categories: string[];

  @IsArray()
  @IsString({
    each: true,
  })
  tags: string[];

  @IsArray()
  @ValidateNested()
  @Type(() => ProductCharacteristicDto)
  characteristics: ProductCharacteristicDto[];
}
