import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async getAll() {
    return await this.userModel.find();
  }

  public async getById(id: string) {
    return await this.userModel.findById(id);
  }

  public async getByEmail(email: string) {
    return await this.userModel.findOne({
      email: email,
    });
  }

  public async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate({ _id: id }, updateUserDto);
  }

  public async removeAvatar(id: string) {
    return await this.userModel.findByIdAndUpdate(
      { _id: id },
      {
        avatar: null,
      },
    );
  }

  public async delete(id: string) {
    return await this.userModel.deleteOne({
      _id: id,
    });
  }
}
