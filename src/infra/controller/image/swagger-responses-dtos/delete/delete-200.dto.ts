import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class Delete200DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Image deleted successfully',
  })
  @IsString()
  message: string;
}
