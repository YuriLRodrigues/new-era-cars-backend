import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FindAllAdIsLiked404DTO {
  @ApiProperty({
    example: 404,
    description: 'O status da resposta',
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    example: 'Advertisement not found',
    description: 'O retorno da resposta',
  })
  @IsString()
  error: string;
}
