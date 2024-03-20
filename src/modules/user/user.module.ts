import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ReqresService } from './services/reqres.service';
import { CreateUserFeature } from './features/create-user.feature';
import { GetUserFeature } from './features/get-user.feature';
import { GetUsersFeature } from './features/get-users.feature';
import { GetUserAvatarFeature } from './features/get-user-avatar.feature';
import { UpdateUserFeature } from './features/update-user.feature';
import { DeleteUserAvatarFeature } from './features/delete-user-avatar.feature';
import { UserAvatarDeletedListener } from './listeners/user-avatar-deleted.listener';
import { CacheService } from '../core/services/cache.service';
import { UserJob } from './queues/user.job';
import { UserQueue } from './queues/user.queue';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    CreateUserFeature,
    ReqresService,
    GetUserFeature,
    GetUsersFeature,
    GetUserAvatarFeature,
    UpdateUserFeature,
    DeleteUserAvatarFeature,
    UserAvatarDeletedListener,
    CacheService,
    UserJob,
    UserQueue,
  ],
  controllers: [UserController],
})
export class UserModule {}
