import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Тест',
  title: 'Заголовок',
  description: 'Описання тестове',
  rating: 5,
  createdDate: new Date(),
  productId,
};
let token: string;

const user: AuthDto = {
  login: 'test2@gmail.com',
  password: 'test12',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/signin/')
      .send(user);
    token = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201);

    createdId = response.body._id;
    expect(createdId).toBeDefined();

    return response;
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 32 })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', async () => {
    const response = await request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200);

    const body = response.body;
    expect(body.length).toBe(1);

    return response;
  });

  it('/review/byProduct/:productId (GET) - fail', () => {
    return request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(404);
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });
  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)
      .expect({
        message: REVIEW_NOT_FOUND,
        error: 'Not Found',
        statusCode: 404,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
