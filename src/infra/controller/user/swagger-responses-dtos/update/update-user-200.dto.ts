import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUser200DTO {
  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'User successfully updated',
  })
  @IsString()
  message: string;
}
