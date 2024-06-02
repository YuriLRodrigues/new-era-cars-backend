import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FindAll401DTO {
  @ApiProperty({
    example: 401,
    description: 'O status da resposta',
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    example: 'You do not have permission to find all images',
    description: 'O retorno da resposta',
  })
  @IsString()
  message: string;
}
