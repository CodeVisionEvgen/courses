import { Injectable } from '@nestjs/common';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TopLevelCategory, TopPage } from './top-page.model';
import { Model } from 'mongoose';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPage.name) private readonly TopPageModel: Model<TopPage>,
  ) {}
  async create(dto: CreateTopPageDto) {
    return await this.TopPageModel.create(dto);
  }

  async findById(id: string) {
    return await this.TopPageModel.findById(id);
  }

  async findByAlias(alias: string) {
    return await this.TopPageModel.findOne({ alias });
  }

  async findByCategory(firstCategory: TopLevelCategory) {
    return await this.TopPageModel.aggregate([
      {
        $match: {
          firstCategory,
        },
      },
      {
        $group: {
          _id: {
            secondCategory: '$secondCategory',
          },
          pages: {
            $push: {
              alias: '$alias',
              title: '$title',
            },
          },
        },
      },
    ]);
  }

  async findByText(text: string) {
    return await this.TopPageModel.find({
      $text: {
        $search: text,
        $caseSensitive: false,
      },
    });
  }

  async deleteById(id: string) {
    return await this.TopPageModel.findByIdAndDelete(id);
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return await this.TopPageModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }
}
