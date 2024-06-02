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
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateAdDTO {
  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'O id do anúncio a ser atualizado',
  })
  @IsArray()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 10000, description: 'A quilometragem do veículo' })
  @IsNumber()
  @IsOptional()
  km?: number;

  @ApiProperty({ example: 'Cidade - Estado', description: 'A localização do anúncio' })
  @IsString()
  @IsOptional()
  localization?: string;

  @ApiProperty({ example: '(31) 93333-4444', description: 'O número de telefone de contato' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Honda Civic', description: 'O título do anúncio' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'url-test',
    description: 'A url da thumbnail',
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ example: 'Carro seminovo, nunca batio...', description: 'A descrição do anúncio' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 2024, description: 'O ano do veículo' })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: ['recurso1', 'recurso2'], description: 'Detalhes adicionais opcionais sobre o veículo' })
  @IsString({ each: true })
  @IsOptional()
  details?: string[];

  @ApiProperty({
    example: 'e5a67153-d256-4721-b791-760fcd581c7b',
    description: 'O identificador único da marca do veículo',
  })
  @IsString()
  @IsOptional()
  brandId?: string;

  @ApiProperty({ enum: Doors, description: 'Número de portas do veículo' })
  @IsEnum(Doors)
  @IsOptional()
  doors?: Doors;

  @ApiProperty({ enum: Model, description: 'O modelo/tipo do veículo' })
  @IsEnum(Model)
  @IsOptional()
  model?: Model;

  @ApiProperty({ enum: Color, description: 'A cor do veículo' })
  @IsEnum(Color)
  @IsOptional()
  color?: Color;

  @ApiProperty({ example: 25000, description: 'O preço do veículo' })
  @IsNumber()
  @IsOptional()
  price?: number;

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
  @IsOptional()
  gearBox?: GearBox;

  @ApiProperty({ enum: Fuel, description: 'O tipo de combustível do veículo' })
  @IsEnum(Fuel)
  @IsOptional()
  fuel?: Fuel;

  @ApiProperty({ enum: Capacity, description: 'A capacidade de assentos do veículo' })
  @IsEnum(Capacity)
  @IsOptional()
  capacity?: Capacity;
}
