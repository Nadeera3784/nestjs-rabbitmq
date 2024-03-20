import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

class MockUserModel {
  static find() {
    return {
      exec: jest.fn(),
    };
  }
}

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: MockUserModel,
        },
      ],
    }).compile();

    userModel = module.get<Model<User>>(getModelToken(User.name));
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    beforeAll(() => {
      userModel.find = jest.fn().mockResolvedValue([
        {
          _id: '5dbff32e367a343830cd2f49',
          name: 'John Doe',
          email: 'johdoe@gmail.com',
          avatar: null,
          createdAt: '2024-03-19T23:56:14.813Z',
          updatedAt: '2024-03-19T23:57:46.968Z',
        },
        {
          _id: '1dbff32e367a343820cd2f49',
          name: 'Smith macory',
          email: 'smithmaoc@gmail.com',
          avatar: null,
          createdAt: '2024-03-19T23:56:14.813Z',
          updatedAt: '2024-03-19T23:57:46.968Z',
        },
      ]);
    });

    it('Should return all users', async () => {
      const userService = new UserService(userModel);
      const expected = [
        {
          _id: '5dbff32e367a343830cd2f49',
          name: 'John Doe',
          email: 'johdoe@gmail.com',
          avatar: null,
          createdAt: '2024-03-19T23:56:14.813Z',
          updatedAt: '2024-03-19T23:57:46.968Z',
        },
        {
          _id: '1dbff32e367a343820cd2f49',
          name: 'Smith macory',
          email: 'smithmaoc@gmail.com',
          avatar: null,
          createdAt: '2024-03-19T23:56:14.813Z',
          updatedAt: '2024-03-19T23:57:46.968Z',
        },
      ];
      const users = await userService.getAll();

      expect(users).toEqual(expected);

      users.forEach((element) => {
        expect(element).toHaveProperty('_id');
        expect(element).toHaveProperty('email'),
          expect(element).toHaveProperty('avatar'),
          expect(element).toHaveProperty('createdAt'),
          expect(element).toHaveProperty('updatedAt');
      });
    });
  });

  describe('getById', () => {
    it('Should return a single user by id', async () => {
      userModel.findById = jest.fn().mockResolvedValue({
        _id: '5dbff32e367a343830cd2f49',
        name: 'John Doe',
        email: 'johdoe@gmail.com',
        avatar: null,
        createdAt: '2024-03-19T23:56:14.813Z',
        updatedAt: '2024-03-19T23:57:46.968Z',
      });

      const userService = new UserService(userModel);

      const user = await userService.getById('5dbff32e367a343830cd2f49');

      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('email'),
        expect(user).toHaveProperty('avatar'),
        expect(user).toHaveProperty('createdAt'),
        expect(user).toHaveProperty('updatedAt');
    });

    it('Should return null when id does not exist', async () => {
      userModel.findById = jest.fn().mockResolvedValue(null);
      const userService = new UserService(userModel);
      const user = await userService.getById('1111111111111');
      expect(user).toBeNull();
    });
  });

  describe('getByEmail', () => {
    it('Should return a single user by email', async () => {
      userModel.findOne = jest.fn().mockResolvedValue({
        _id: '5dbff32e367a343830cd2f49',
        name: 'John Doe',
        email: 'johdoe@gmail.com',
        avatar: null,
        createdAt: '2024-03-19T23:56:14.813Z',
        updatedAt: '2024-03-19T23:57:46.968Z',
      });

      const userService = new UserService(userModel);

      const user = await userService.getByEmail('johdoe@gmail.com');

      expect(user).toHaveProperty('_id');
      expect(user).toHaveProperty('email'),
        expect(user).toHaveProperty('avatar'),
        expect(user).toHaveProperty('createdAt'),
        expect(user).toHaveProperty('updatedAt');
    });

    it('Should return null when email does not exist', async () => {
      userModel.findOne = jest.fn().mockResolvedValue(null);
      const userService = new UserService(userModel);
      const user = await userService.getByEmail('nonexistent@gmail.com');
      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    beforeAll(() => {
      userModel.create = jest.fn().mockResolvedValue([
        {
          _id: '5dbff32e367a343830cd2f49',
          name: 'John Doe',
          email: 'johdoe@gmail.com',
          avatar: null,
          createdAt: '2024-03-19T23:56:14.813Z',
          updatedAt: '2024-03-19T23:57:46.968Z',
        },
      ]);
    });

    it('Should create a new user', async () => {
      const userService = new UserService(userModel);
      const expected = [
        {
          _id: '5dbff32e367a343830cd2f49',
          name: 'John Doe',
          email: 'johdoe@gmail.com',
          avatar: null,
          createdAt: '2024-03-19T23:56:14.813Z',
          updatedAt: '2024-03-19T23:57:46.968Z',
        },
      ];

      const payload = {
        name: 'John Doe',
        email: 'johdoe@gmail.com',
        avatar: null,
      };

      const user = await userService.create(payload);

      expect(user).toEqual(expected);
    });
  });
});
