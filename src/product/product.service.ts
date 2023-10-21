import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.model';
import { Model } from 'mongoose';
import { createProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { Review } from 'src/review/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(dto: createProductDto) {
    return this.productModel.create(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id);
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }

  async updateById(id: string, dto: createProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $addFields: {
            product_id: {
              $toString: '$_id',
            },
          },
        },
        {
          $lookup: {
            from: 'reviews',
            localField: 'product_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewCount: { $size: '$reviews' },
            reviewAvg: { $avg: '$reviews.rating' },
            reviews: {
              $function: {
                body: `function (reviews) {
                  reviews.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
                  return reviews
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec() as unknown as (Product & {
      review: Review;
      reviewCount: number;
      ReviewAvg: number;
    })[];
  }
}
