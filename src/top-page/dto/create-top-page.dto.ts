import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TopLevelCategory } from '../top-page.model';
import { Type } from 'class-transformer';
class TopPageAdvanatage {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

class JobData {
  @IsNumber()
  count: number;

  @IsNumber()
  juniorSalary: number;

  @IsNumber()
  middleSalary: number;

  @IsNumber()
  seniorSalary: number;
}

export class CreateTopPageDto {
  @IsEnum(TopLevelCategory)
  firstCategory: TopLevelCategory;

  @IsString()
  secondCategory: string;

  @IsString()
  alias: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => JobData)
  jobData: JobData;

  @IsArray()
  @ValidateNested()
  @Type(() => TopPageAdvanatage)
  advantages: TopPageAdvanatage[];

  @IsString()
  seoText: string;

  @IsString()
  tagsTitle: string;

  @IsArray()
  @IsString({
    each: true,
  })
  tags: string[];
}
