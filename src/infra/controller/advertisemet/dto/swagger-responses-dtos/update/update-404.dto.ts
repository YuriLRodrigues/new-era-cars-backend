import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Update404DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 404,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Erro retornado na resposta',
    example: 'Ad not found',
  })
  @IsString()
  error: string;
}
