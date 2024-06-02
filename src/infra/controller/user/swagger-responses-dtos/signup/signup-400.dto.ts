import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Signup400DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 400,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Erro retornado na resposta',
    example: 'Internal API error',
  })
  @IsString()
  error: string;
}
