import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReqresService {
  constructor(private configService: ConfigService) {}

  public async getById(id: number) {
    const response = await fetch(
      `${this.configService.get('app.reqres_api')}/users/${id}`,
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch user data: ${response.status} - ${response.statusText}`,
      );
    }
    return await response.json();
  }
}
