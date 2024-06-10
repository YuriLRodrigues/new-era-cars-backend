import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdatedAd200DTO {
  @ApiProperty({
    example: 200,
    description: 'O status da resposta',
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    example: 'Ad successfully updated',
    description: 'O retorno da resposta',
  })
  @IsString()
  message: string;
}
