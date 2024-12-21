import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

class BrandDTO {
  @ApiProperty({
    description: 'Nome da marca',
    example: 'MyBrand',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL do logotipo da marca',
    example: 'https://example.com/logo.png',
  })
  @IsString()
  logoUrl: string;

  @ApiProperty({
    description: 'Data de criação da marca',
    example: '2023-01-01T00:00:00Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Data de atualização da marca (opcional)',
    example: '2023-06-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}

export class FindAllBrands200DTO {
  @ApiProperty({
    description: 'Código de status HTTP',
    example: 200,
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Brand successfully created',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Dados da entidade da marca criada',
    type: Array<BrandDTO>,
  })
  results: Array<BrandDTO>;
}
