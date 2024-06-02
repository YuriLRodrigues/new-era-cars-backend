import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

class Image {
  @ApiProperty({
    description: 'O id da imagem que foi enviada ao bucket',
    example: '121gsds-sahsa1ks-2ghsd',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Url da imagem enviada para o bucket',
    example: 'http://example.com',
  })
  @IsString()
  url: string;
}

export class Upload201DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 201,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Image uploaded successfully',
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: Image,
    description: 'A resposta do upload da imagem',
  })
  @Type(() => Image)
  response: Image;
}
