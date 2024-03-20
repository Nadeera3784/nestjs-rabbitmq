import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
}

function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = `${configService.get('app.disk')}`;
      const destination = `${filesDestination}${options.path}`;
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, callback) => {
            const ext = path.extname(file.originalname);
            const randomName = `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}`;
            callback(null, `${randomName}${ext}`);
          },
        }),
      };
      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
