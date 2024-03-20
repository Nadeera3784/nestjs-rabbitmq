import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserAvatarDeletedEvent } from '../events/user-avatar-deleted.event';
import { Events } from '../enums/events.enum';
import { UserService } from '../services/user.service';

@Injectable()
export class UserAvatarDeletedListener {
  constructor(private readonly userService: UserService) {}

  @OnEvent(Events.USER_AVATAR_DELETED_EVENT)
  async handleUserRegisterdEvent(event: UserAvatarDeletedEvent) {
    await this.userService.removeAvatar(event.id);
  }
}
