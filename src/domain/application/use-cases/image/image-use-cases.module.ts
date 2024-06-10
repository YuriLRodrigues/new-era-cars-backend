import { Module } from '@nestjs/common';
import { DatabaseModule } from '@root/infra/database/database.module';

import { DeleteImageUseCase } from './delete-image.use-case';
import { FindAllImagesUseCase } from './find-all-images.use-case';
import { UpdateImageUseCase } from './update-image.use-case';
import { UploadImageUseCase } from './upload-image.use-case';

@Module({
  imports: [DatabaseModule],
  providers: [DeleteImageUseCase, UpdateImageUseCase, UploadImageUseCase, FindAllImagesUseCase],
  exports: [DeleteImageUseCase, UpdateImageUseCase, UploadImageUseCase, FindAllImagesUseCase],
})
export class ImageUseCasesModule {}
