import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class FindAllFbIsLiked200DTO {
  @ApiProperty({
    description: 'Código de status da resposta',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Validation if the user has already liked found',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: true,
  })
  @IsBoolean()
  results: boolean;
}
