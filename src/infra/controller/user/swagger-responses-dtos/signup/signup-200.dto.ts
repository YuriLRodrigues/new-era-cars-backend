import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class Signup201DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 201,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'User created successfully',
  })
  @IsString()
  message: string;
}
