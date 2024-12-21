import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class Delete200DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Brand successfully deleted',
  })
  @IsString()
  message: string;
}
