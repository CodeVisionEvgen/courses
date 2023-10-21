import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopPage } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { ConfigService } from '@nestjs/config';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { idValidationPipe } from 'src/pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(
    private readonly configService: ConfigService,
    private readonly TopPageService: TopPageService,
  ) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return await this.TopPageService.create(dto);
  }

  @Get(':id')
  async get(@Param('id', idValidationPipe) id: string) {
    const topPage = await this.TopPageService.findById(id);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return topPage;
  }

  @Get('ByAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const topPage = await this.TopPageService.findByAlias(alias);
    if (!topPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return topPage;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', idValidationPipe) id: string) {
    const topPageDeleted = await this.TopPageService.deleteById(id);
    if (!topPageDeleted) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return topPageDeleted;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', idValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const topPageUpdated = await this.TopPageService.updateById(id, dto);
    if (!topPageUpdated) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
    }

    return topPageUpdated;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.TopPageService.findByCategory(dto.firstCategory);
  }

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.TopPageService.findByText(text);
  }
}
