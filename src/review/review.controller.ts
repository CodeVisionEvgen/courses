import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return await this.reviewService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {
      throw new NotFoundException(REVIEW_NOT_FOUND);
    } else {
      return deletedDoc;
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId') productId: string,
    @UserEmail() email: string,
  ) {
    const findDocs = await this.reviewService.findByProductId(productId);
    if (findDocs.length === 0) {
      throw new NotFoundException(REVIEW_NOT_FOUND);
    } else {
      return findDocs;
    }
  }
}
