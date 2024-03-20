import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import LocalFilesInterceptor from '../interceptors/local-files.interceptor';
import { CreateUserFeature } from '../features/create-user.feature';
import { GetUserFeature } from '../features/get-user.feature';
import { GetUsersFeature } from '../features/get-users.feature';
import { GetUserAvatarFeature } from '../features/get-user-avatar.feature';
import { UpdateUserFeature } from '../features/update-user.feature';
import { DeleteUserAvatarFeature } from '../features/delete-user-avatar.feature';

@Controller('user')
export class UserController {
  constructor(
    private readonly createUserFeature: CreateUserFeature,
    private readonly getUserFeature: GetUserFeature,
    private readonly getUsersFeature: GetUsersFeature,
    private readonly getUserAvatarFeature: GetUserAvatarFeature,
    private readonly updateUserFeature: UpdateUserFeature,
    private readonly deleteUserAvatarFeature: DeleteUserAvatarFeature,
  ) {}

  @Get()
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getUsersFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  public async getById(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.getUserFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id/avatar')
  public async getByAvatar(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.getUserAvatarFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'avatar',
      path: '/avatars',
    }),
  )
  public async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
    @Res() response,
  ) {
    const { status, response: featureUpResponse } =
      await this.createUserFeature.handle(createUserDto, file);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  public async update(
    @Res() response,
    @Param() { id },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateUserFeature.handle(updateUserDto, id);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id/avatar')
  public async delete(@Res() response, @Param() { id }) {
    const { status, response: featureUpResponse } =
      await this.deleteUserAvatarFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }
}
