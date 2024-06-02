import { ApiProperty } from '@nestjs/swagger';
import {
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

class CreateAd {
  @ApiProperty({
    example: ['e5a67153-d256-4721-b791-760fcd581c7b', 'ea34fd256-4721-b791'],
    description: 'Os ids das imagens do anúncio',
  })
  @IsArray()
  @IsNotEmpty()
  imagesIds: string[];

  @ApiProperty({ example: 10000, description: 'A quilometragem do veículo' })
  @IsNumber()
  @IsNotEmpty()
  km: number;

  @ApiProperty({ example: 'Cidade - Estado', description: 'A localização do anúncio' })
  @IsString()
  @IsNotEmpty()
  localization: string;

  @ApiProperty({ example: '(31) 93333-4444', description: 'O número de telefone de contato' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Honda Civic', description: 'O título do anúncio' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'test-url',
    description: 'A url da thumbnail',
  })
  @IsString()
  @IsNotEmpty()
  thumbnailUrl: string;

  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'O identificador único do usuário que publicou o anúncio',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'Carro seminovo, nunca batio...', description: 'A descrição do anúncio' })
  @IsString()
  @IsNotEmpty()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2024, description: 'O ano do veículo' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: ['recurso1', 'recurso2'], description: 'Detalhes adicionais opcionais sobre o veículo' })
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'O identificador único da marca do veículo',
  })
  @IsString()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({ enum: Doors, description: 'Número de portas do veículo' })
  @IsEnum(Doors)
  doors: Doors;

  @ApiProperty({ enum: Model, description: 'O modelo/tipo do veículo' })
  @IsEnum(Model)
  @IsNotEmpty()
  model: Model;

  @ApiProperty({ enum: Color, description: 'A cor do veículo' })
  @IsEnum(Color)
  @IsNotEmpty()
  color: Color;

  @ApiProperty({ example: 25000, description: 'O preço do veículo' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ enum: SoldStatus, description: 'Flag indicando se o veículo foi vendido' })
  @IsEnum(SoldStatus)
  @IsOptional()
  soldStatus?: SoldStatus;

  @ApiProperty({ example: 22000, description: 'O preço de venda do veículo se foi vendido' })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ enum: GearBox, description: 'O tipo de caixa de câmbio no veículo' })
  @IsEnum(GearBox)
  @IsNotEmpty()
  gearBox: GearBox;

  @ApiProperty({ enum: Fuel, description: 'O tipo de combustível do veículo' })
  @IsEnum(Fuel)
  @IsNotEmpty()
  fuel: Fuel;

  @ApiProperty({ enum: Capacity, description: 'A capacidade de assentos do veículo' })
  @IsEnum(Capacity)
  @IsNotEmpty()
  capacity: Capacity;
}

export class CreateAd200DTO {
  @ApiProperty({
    example: CreateAd,
    description: 'A resposta da criação do anúncio',
  })
  @Type(() => CreateAd)
  response: CreateAd;

  @ApiProperty({
    example: 200,
    description: 'O status da resposta',
  })
  @IsNumber()
  statusCode: number;

  @ApiProperty({
    example: 'Advertisement created successfully',
    description: 'O retorno da resposta',
  })
  @IsString()
  message: string;
}
