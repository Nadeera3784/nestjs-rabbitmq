import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { UserService } from '../services/user.service';

@Injectable()
export class GetUserAvatarFeature extends BaseFeature {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.userService.getById(id);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        null,
        data?.avatar?.value,
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
