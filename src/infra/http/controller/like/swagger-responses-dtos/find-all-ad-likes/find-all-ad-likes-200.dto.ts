import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FindAllAdLikes200DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Like count by advertisement was found successfully',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 1000,
  })
  @IsNumber()
  results: number;
}
