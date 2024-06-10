import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Update403DTO {
  @ApiProperty({
    example: 403,
    description: 'O status da resposta',
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    example: 'You do not have permission to update this ad',
    description: 'O retorno da resposta',
  })
  @IsString()
  message: string;
}
