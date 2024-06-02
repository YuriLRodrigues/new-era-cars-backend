import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Signup409DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 409,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Erro retornado na resposta',
    example: 'User already exists',
  })
  @IsString()
  error: string;
}
