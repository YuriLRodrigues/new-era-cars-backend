import { ApiProperty } from '@nestjs/swagger';
import { Color, FilterDate, Fuel, Likes, Model } from '@root/domain/enterprise/entities/advertisement.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class QuerySearchDto {
  @ApiProperty({ example: 'SUV', description: 'The model/type of the vehicle' })
  @IsEnum(Model)
  @IsOptional()
  model?: Model;

  @ApiProperty({ example: 'Gasoline', description: 'The type of fuel of the vehicle' })
  @IsEnum(Fuel)
  @IsOptional()
  fuel?: Fuel;

  @ApiProperty({ example: 10000, description: 'The maximum desired mileage' })
  @IsNumber()
  @IsOptional()
  km?: number;

  @ApiProperty({ example: 'Honda', description: 'The brand of the vehicle' })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'Black', description: 'The color of the vehicle' })
  @IsEnum(Color)
  @IsOptional()
  color?: Color;

  @ApiProperty({ example: 2020, description: 'The year of the vehicle' })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 25000, description: 'The maximum desired price' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 'desc', description: 'The order of advertisements by date' })
  @IsEnum(FilterDate)
  @IsOptional()
  date?: FilterDate;

  @ApiProperty({ example: 'desc', description: 'The order of advertisements by likes' })
  @IsEnum(Likes)
  @IsOptional()
  likes?: Likes;
}
