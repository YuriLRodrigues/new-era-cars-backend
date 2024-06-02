import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BlockSeller200DTO {
  @ApiProperty({
    description: 'Mensagem retornada da resposta',
    example: 'Seller successfully blocked',
  })
  @IsString()
  message: string;
}
