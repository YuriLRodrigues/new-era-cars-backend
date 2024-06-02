import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DeleteUser401DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 401,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de erro',
    example: 'Invalid permission to delete an user',
  })
  @IsString()
  error: string;
}
