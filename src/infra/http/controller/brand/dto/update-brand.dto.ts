import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDTO {
  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'A URL do logo da marca',
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiProperty({
    example: 'Honda',
    description: 'O nome da marca',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
