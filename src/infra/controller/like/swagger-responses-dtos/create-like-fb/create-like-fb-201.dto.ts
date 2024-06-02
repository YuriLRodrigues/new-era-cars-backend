import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLikeFb201DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 201,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Like created successfully in feedback',
  })
  @IsString()
  message: string;
}
