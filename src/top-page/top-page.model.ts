import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class JobData {
  @Prop()
  count: number;
  @Prop()
  juniorSalary: number;
  @Prop()
  middleSalary: number;
  @Prop()
  seniorSalary: number;
}

export class TopPageAdvanatage {
  @Prop()
  title: string;
  @Prop()
  description: string;
}

@Schema({
  timestamps: true,
})
export class TopPage extends Document {
  @Prop({
    enum: TopLevelCategory,
  })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({
    unique: true,
  })
  alias: string;

  @Prop({})
  title: string;

  @Prop()
  category: string;

  @Prop({
    type: JobData,
  })
  jobSalary?: JobData;

  @Prop({
    type: () => [TopPageAdvanatage],
  })
  advanatages: TopPageAdvanatage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop({
    type: [{ type: String }],
  })
  tags: string[];
}

const TopPageSchema = SchemaFactory.createForClass(TopPage);

TopPageSchema.index({ '$**': 'text' });

export { TopPageSchema };
