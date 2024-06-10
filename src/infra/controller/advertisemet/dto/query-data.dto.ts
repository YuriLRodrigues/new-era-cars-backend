import { ApiProperty } from '@nestjs/swagger';
import { Color, FilterDate, Fuel, Likes, Model } from '@root/domain/enterprise/entities/advertisement.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryDataDTO {
  @ApiProperty({ example: 'SUV', description: 'O modelo/tipo do veículo' })
  @IsEnum(Model)
  @IsOptional()
  model?: Model;

  @ApiProperty({ example: 'Gasolina', description: 'O tipo de combustível do veículo' })
  @IsEnum(Fuel)
  @IsOptional()
  fuel?: Fuel;

  @ApiProperty({ example: 10000, description: 'A quilometragem máxima desejada' })
  @IsNumber()
  @IsOptional()
  km?: number;

  @ApiProperty({ example: 'Honda', description: 'A marca do veículo' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'Preto', description: 'A cor do veículo' })
  @IsEnum(Color)
  @IsOptional()
  color?: Color;

  @ApiProperty({ example: 2020, description: 'O ano do veículo' })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 25000, description: 'O preço máximo desejado' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'desc', description: 'A ordem dos anúncios de acordo com a data' })
  @IsEnum(FilterDate)
  @IsOptional()
  FilterDate?: FilterDate;

  @ApiProperty({ example: 'desc', description: 'A ordem dos anúncios de acordo com os likes' })
  @IsEnum(Likes)
  @IsOptional()
  likes?: Likes;
}
