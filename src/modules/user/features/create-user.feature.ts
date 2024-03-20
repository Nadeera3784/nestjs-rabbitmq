import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { base64Encode } from '../../app/utl';
import { UserJob } from '../queues/user.job';

@Injectable()
export class CreateUserFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private userJob: UserJob,
  ) {
    super();
  }

  public async handle(createUserDto: CreateUserDto, file: Express.Multer.File) {
    try {
      const existingUser = await this.userService.getByEmail(
        createUserDto.email,
      );

      if (existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          `User with ${existingUser.email}  already exists`,
        );
      }

      const base64Image = base64Encode(file.path, file.mimetype);

      createUserDto.avatar = {
        key: file.filename,
        value: base64Image,
      };

      const data = await this.userService.create(createUserDto);

      await this.sendWelcomeEmail(data);

      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'User has been created successfully',
        data,
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

  private async sendWelcomeEmail(user: any) {
    const emailData = {
      email: user?.email,
      subject: 'Welcome to Our Community',
      html: `<p>Hello ${user?.name},</p>
        <p>Welcome to our community! Your account is now active.</p>
        <p>Enjoy your time with us!</p>`,
    };
    await this.userJob.addToEmailQueue(emailData);
  }
}
