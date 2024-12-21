import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLikeAd201DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 201,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Like created successfully in advertisement',
  })
  @IsString()
  message: string;
}
