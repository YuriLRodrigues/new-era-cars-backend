import { Module } from '@nestjs/common';
import { Uploader } from '@root/domain/application/repositories/uploader.repository';

import { MinioStorage } from './minio.storage';

@Module({
  providers: [{ provide: Uploader, useClass: MinioStorage }],
  exports: [Uploader],
})
export class StorageModule {}
