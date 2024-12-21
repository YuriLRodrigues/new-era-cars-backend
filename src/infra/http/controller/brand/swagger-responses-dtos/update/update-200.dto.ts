import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
export class Update200DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Brand updated successfully',
  })
  @IsString()
  message: string;
}
