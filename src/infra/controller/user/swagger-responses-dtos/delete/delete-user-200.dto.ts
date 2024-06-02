import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteUser200DTO {
  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Your user has been successfully deleted',
  })
  @IsString()
  message: string;
}
