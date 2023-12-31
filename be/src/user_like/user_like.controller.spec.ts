import { Test, TestingModule } from '@nestjs/testing';
import { UserLikeController } from './user_like.controller';

describe('UserLikeController', () => {
  let controller: UserLikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserLikeController],
    }).compile();

    controller = module.get<UserLikeController>(UserLikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
