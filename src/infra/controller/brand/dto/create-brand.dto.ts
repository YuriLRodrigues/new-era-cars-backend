import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDTO {
  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'A URL do logo da marca',
  })
  @IsString()
  logoUrl: string;

  @ApiProperty({
    example: 'Honda',
    description: 'O nome da marca',
  })
  @IsString()
  name: string;
}
