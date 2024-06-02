import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryDataDTO {
  @ApiProperty({ example: 'SUV', description: 'O modelo/tipo do veículo' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 'Gasolina', description: 'O tipo de combustível do veículo' })
  @IsString()
  @IsOptional()
  fuel?: string;

  @ApiProperty({ example: '10000', description: 'A quilometragem máxima desejada' })
  @IsString()
  @IsOptional()
  km?: string;

  @ApiProperty({ example: 'Honda', description: 'A marca do veículo' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'Preto', description: 'A cor do veículo' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: '2020', description: 'O ano do veículo' })
  @IsString()
  @IsOptional()
  year?: string;

  @ApiProperty({ example: '25000', description: 'O preço máximo desejado' })
  @IsString()
  @IsOptional()
  price?: string;
}
