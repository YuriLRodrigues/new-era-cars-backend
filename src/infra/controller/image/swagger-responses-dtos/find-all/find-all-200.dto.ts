import { ApiProperty } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

class ImageReturn {
  @IsString()
  url: string;

  @Type(() => UniqueEntityId)
  advertisementImageId?: UniqueEntityId;

  @Type(() => UniqueEntityId)
  advertisementThumbnailId?: UniqueEntityId;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt?: Date;
}

export class FindAll200DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Images found',
  })
  @IsString()
  message: string;

  @Type(() => Array<ImageReturn>)
  response: ImageReturn[];
}
