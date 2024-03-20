import { Injectable, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { UserService } from '../services/user.service';
import { UserAvatarDeletedEvent } from '../events/user-avatar-deleted.event';
import { Events } from '../enums/events.enum';
import { deleteFile } from '../../app/utl';

@Injectable()
export class DeleteUserAvatarFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.userService.getById(id);

      const filePath = `${this.configService.get('app.disk')}/avatars/`;
      const fileName = `${data.avatar.key}`;
      await deleteFile(filePath, fileName);
      this.publishEvents(data._id);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'Avatar has been deleted successfully',
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

  private async publishEvents(id: string) {
    const event = new UserAvatarDeletedEvent();
    event.id = id;
    this.eventEmitter.emit(Events.USER_AVATAR_DELETED_EVENT, event);
  }
}
