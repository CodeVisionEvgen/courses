import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPage, TopPageSchema } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
  controllers: [TopPageController],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: TopPage.name,
        schema: TopPageSchema,
      },
    ]),
  ],
  providers: [TopPageService],
})
export class TopPageModule {}
