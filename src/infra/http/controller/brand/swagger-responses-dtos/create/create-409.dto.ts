import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Create409DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 409,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Brand already exists',
  })
  @IsString()
  error: string;
}
