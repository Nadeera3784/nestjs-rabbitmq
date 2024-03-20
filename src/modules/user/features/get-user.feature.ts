import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { ReqresService } from '../services/reqres.service';
import { CacheService } from '../../core/services/cache.service';

@Injectable()
export class GetUserFeature extends BaseFeature {
  constructor(
    private readonly reqresService: ReqresService,
    private readonly cacheService: CacheService,
  ) {
    super();
  }

  public async handle(id: number) {
    try {
      const cacheKey = 'user:single' + id;
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) {
        return this.responseSuccess(
          HttpStatus.OK,
          ResponseType.SUCCESS,
          null,
          cachedData,
        );
      }
      const data = await this.reqresService.getById(id);
      await this.cacheService.set(cacheKey, 120, data);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        null,
        data?.data,
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        ResponseType.ERROR,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
