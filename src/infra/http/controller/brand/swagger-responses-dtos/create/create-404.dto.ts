import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Create404DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 404,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'User not found',
  })
  @IsString()
  error: string;
}
