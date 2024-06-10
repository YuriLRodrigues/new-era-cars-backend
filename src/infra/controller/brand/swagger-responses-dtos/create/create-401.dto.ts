import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Create401DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 401,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'You are not allowed to create a brand',
  })
  @IsString()
  error: string;
}
