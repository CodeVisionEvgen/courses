import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { disconnect } from 'mongoose';

const user = {
  login: 'test2@gmail.com',
  password: 'test12',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signin (POST) - success', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(user)
      .expect(200);
  });

  it('/auth/signin (POST) - password fail', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ ...user, password: 'errorPWD' })
      .expect(401);
  });

  it('/auth/signin (POST) - login fail', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({ ...user, login: 'feorijgo' })
      .expect(401);
  });

  afterAll(() => {
    disconnect();
  });
});
