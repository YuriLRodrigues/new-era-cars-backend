import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Update401DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 401,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'You are not allowed to update this brand',
  })
  @IsString()
  error: string;
}
