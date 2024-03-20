import { Test, TestingModule } from '@nestjs/testing';
import { ReqresService } from './reqres.service';
import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';

describe('ReqresService', () => {
  let service: ReqresService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqresService, ConfigService],
    }).compile();

    config = module.get<ConfigService>(ConfigService);
    service = module.get<ReqresService>(ReqresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user data', async () => {
    const id = faker.number.int({ max: 20 });
    jest.spyOn(config, 'get').mockReturnValue('https://reqres.in/api');

    const mockUserData = {
      data: {
        id: 11,
        email: 'george.edwards@reqres.in',
        first_name: 'George',
        last_name: 'Edwards',
        avatar: 'https://reqres.in/img/faces/11-image.jpg',
      },
      support: {
        url: 'https://reqres.in/#support-heading',
        text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
      },
    };

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockUserData),
    } as any);

    const response = await service.getById(id);

    expect(response).toBeTruthy();

    expect(response).toEqual(mockUserData);

    expect(response.data).toBeTruthy();

    expect(response.data.first_name).toBeTruthy();

    expect(response.data.last_name).toBeTruthy();

    expect(response.data.avatar).toBeTruthy();
  });

  it('should not return user data', async () => {
    jest.spyOn(config, 'get').mockReturnValue('https://reqres.in/api');

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    } as any);

    const response = await service.getById(0);

    expect(response).toEqual({});

    expect(response.data).toBeFalsy();
  });
});
