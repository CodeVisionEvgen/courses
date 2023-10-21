import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReviewDocument, Review } from './review.model';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

interface IDeleteProduct {
  acknowledged: boolean;
  deletedCount: number;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name)
    private readonly Review: Model<Review>,
  ) {}

  async create(dto: CreateReviewDto): Promise<ReviewDocument> {
    const model = new this.Review(dto);

    return await model.save();
  }

  async delete(id: string): Promise<ReviewDocument | null> {
    return await this.Review.findByIdAndDelete(id);
  }

  async findByProductId(productId: string): Promise<Review[]> {
    return await this.Review.find({
      productId,
    });
  }

  async deleteByProductId(productId: string): Promise<IDeleteProduct> {
    return await this.Review.deleteMany({
      productId,
    });
  }
}
