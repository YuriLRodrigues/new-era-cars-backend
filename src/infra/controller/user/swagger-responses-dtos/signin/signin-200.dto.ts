import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Signin200DTO {
  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'User successfully authenticated',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Token do usuário',
    example: 'eyjhbGci0iJIUz1NUIsInR5sCI6...',
  })
  @IsString()
  token: string;
}
