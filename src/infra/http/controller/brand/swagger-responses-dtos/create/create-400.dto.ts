import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Create400DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 400,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Internal API error',
  })
  @IsString()
  error: string;
}
